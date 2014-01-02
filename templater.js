function Templater (template) {
    this.template = template;
}

Templater.prototype.compile = function (data) {
    var regex = /{{(.*?)}}/g;
    var match, loopMatch;
    
    while ((match = regex.exec(this.template))) {
        var result = "";
        if (!/[!#/]/.test(match[1]))
            this.template = this.template.replace(match[0], getProperty(data, match[1]));
        else {
            if ((loopMatch = /{{!?#(.+?)}}([^]+?){{\/\1}}/g.exec(this.template.substr(regex.lastIndex - match[0].length)))) {
                var loopScope = getProperty(data, loopMatch[1]);
                if (loopScope && loopScope.forEach) // collection, evaluate sub-template for each
                    loopScope.forEach(function (element) {
                        result += new Templater(loopMatch[2]).compile(element);
                    });
                else    // conditional
                    if (/{{!#.*?}}/.test(loopMatch[0])) // scope changer
                        result = loopScope ? new Templater(loopMatch[2]).compile(getProperty(data, loopMatch[1])) : "";
                    else    // non-scope changer
                        result = loopScope ? new Templater(loopMatch[2]).compile(data) : "";
                this.template = this.template.replace(loopMatch[0], result);
            } 
            else  // when this is a broken construct, replace the '{' character with its html escape sequence to break out of the endless loop
                this.template = this.template.replace(/{/g, '&#123;');
        }
        regex.lastIndex -= match[0].length;
    }
    
    return this.template;
    
    function getProperty (data, match) {
        var parts;
        if (/[.]/.test(match)) {    // its in a sub object
            if (match === ".")
                return data;
            else {
                parts = match.split('.');
                return getProperty(data[parts.shift()], parts.join('.'));
            }
        } else {
            parts = match.split(" ");
            var topLevel = parts.shift();
            return typeof data[topLevel] === "function" ? data[topLevel].apply(data, parts) : data[topLevel];
        }
    }
};