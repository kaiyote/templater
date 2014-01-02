#templater
A tiny\* javascript templating engine with all** of the bells and whistles you've come to enjoy.

*2kb unminified, 1kb minified.

**This statement is not fact.  Please consult your doctor before changing templating engines.  The manufacturer is not responsible for errors, failure, loss of job, loss of limbs, or loss of life.

##Contents
- [Installation] (#installation)
- [Usage] (#usage)
- [Todo] (#todo)
- [Basic Syntax] (#basic-syntax)

####Features
- [Basic Properties] (#basic-properties)
- [Nested Properties] (#nested-properties)
- [Functions] (#functions)
- [Conditionals] (#conditionals)
- [Object Loops] (#object-loops)
- [Simple Loops] (#simple-loops)

##Installation
1. Download the js files
2. Reference one of them in your project
3. ???
4. Profit!

##Usage
Simplest usage is as follows:
```javascript
document.querySelector('#doodad').innerHTML = new Templater(templateString).compile(templateData);
```
All items that should be replaced are wrapped in two sets of curly braces.  There is no HTML escaping, so you have to trust the data you're running the template on.

See below for how to use the features of the templating engine.

###Todo
1. Inverse conditionals (*not* something, ^ syntax)
2. ~~Scope shifting conditionals (probably using !# syntax)~~
3. Safe html escaping (for the scaredycats)
4. ~~Being able to iterate over collections of primitive objects ([1,2,3,4] or some such)~~

###Basic Syntax
- `{{propertyName}}` will retrieve propertyName from the current scope
- `{{propertyName.subPropertyName}}` will retrieve subPropertyName from the propertyName object in the current scope
- `{{function arg1 arg2}}` will call `function(arg1, arg2)` on the current scope
- `{{.}}` will print whatever the current scope is (useful for simple array looping, not so much for objects)
- `{{#propertyName}}subTemplateStuff{{/propertyName}}` will be either a conditional or a loop depending on what propertyName is.  Loops will shift scope to each element in the loop, conditionals will not shift scope
- `{{!#propertyName}}subTemplateStuff{{/propertyName}}` has similar functionality to {{#propertyName}} except that conditionals made using this syntax will shift their scope to propertyName

##Features
###Basic Properties
Given an html template string:
```html
<p>My name is {{name}} and your name is {{othername}}.</p>
```
and a data object such as:
```javascript
{
  name: "Bob",
  othername: "Other Bob"
}
```
the template engine will produce:
```html
<p>My name is Bob and your name is Other Bob.</p>
```
###Nested Properties
The engine can read properties on sub-objects of the main template object.  This can continue as deep as your runtime environment will allow.

Given an html template string:
```html
<p>My name is {{sub.name}} and your name is {{sub.othername}}.</p>
```
and a data object such as:
```javascript
{
  sub: {
    name: "Bob",
    othername: "Other Bob"
  }
}
```
the template engine will produce:
```html
<p>My name is Bob and your name is Other Bob.</p>
```
###Functions
You can call functions on the object you are using for the template data.  Function syntax is similar to Handlebars (i.e. list arguments separated by spaces).  It behaves identically to the basic property with regards to object tree traversal.

Given an html template string:
```html
<p>My name is {{sub.name}} and your name is {{othername OtherBob}}. This particular function is retarded.</p>
```
and a data object such as:
```javascript
{
  othername: function (name) {
    return name.split(/[A-Z]/).join(' ');
  },
  sub: {
    name: function () {
      return "Bob";
    }
  }
}
```
the template engine will produce:
```html
<p>My name is Bob and your name is ther ob. This particular function is retarded.</p>
```
###Conditionals
Conditionals evaluate based on the truthy-ness of whatever they are given. Use a '#' as the first character in a token to denote a conditional*.

*NOTE: This is the same syntax as a loop structure.  Therefore, you cannot evaluate a conditional on an array. It will be a loop instead.

*NOTE: A conditional construct will not shift the scope at this time.  That will come in a future update.

*NOTE: Both conditionals and loops must be accompianed by a {{/whatever}} token, to complete the block.

Given an html template string:
```html
{{#name}}<p>My name is {{name}}.</p>{{/name}}
```
and a data object such as:
```javascript
{
  name: "Bob"
}
```
the template engine will produce:
```html
<p>My name is Bob.</p>
```
If you pass it a data object like:
```javascript
{
  notname: "Other Bob"
}
```
the template engine will return an empty string.
###Object Loops
Loops look the same as conditionals, but will happen with the object given to it is an array.  It will then repeat the block within in the loop block for each element in the array, using that object as the scope.

Given an html template string:
```html
<ul>
{{#people}}
<li>Your name is {{name}}.</li>
{{/people}}
</ul>
```
and a data object such as:
```javascript
{
  people: [
    {name: "Bob"},
    {name: "Jane"},
    {name: "Bill"},
    {name: "Mary"}
  ]
}
```
the template engine will produce:
```html
<ul>
<li>Your name is Bob.</li>
<li>Your name is Jane.</li>
<li>Your name is Bill.</li>
<li>Your name is Mary.</li>
</ul>
```
###Simple Loops
Looping over an array of primitive types can also be done.  Using the token "{{.}}", you can cause the engine to print whatever the current scope is.

Given an html template string:
```html
<ul>
{{#numbers}}
<li>{{.}}</li>
{{/numbers}}
</ul>
```
and a data object such as:
```javascript
{
  numbers: [1,2,3,4,5]
}
```
the template engine will produce:
```html
<ul>
<li>1</li>
<li>2</li>
<li>3</li>
<li>4</li>
<li>5</li>
</ul>
```