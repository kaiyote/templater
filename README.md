templater
=========

A tiny\* javascript templating engine with all** of the bells and whistles you've come to enjoy.

*2kb unminified, 1kb minified.

**This statement is not fact.  Please consult your doctor before changing templating engines.  The manufacturer is not responsible for errors, failure, loss of job, loss of limbs, or loss of life.

Contents
--------
- [Installation] (#installation)
- [Usage] (#usage)
- Features
- [Basic Properties] (#basic-properties)
- [Nested Properties] (#nested-properties)
- [Functions] (#functions)
- [Conditionals] (#conditionals)
- [Loops] (#loops)

Installation
============
1. Download the js files
2. Reference one of them in your project
3. ???
4. Profit!

Usage
=====
Simplest usage is as follows:
```javascript
document.querySelector('#doodad').innerHTML = new Templater(templateString, templateData).compile();
```
All items that should be replaced are wrapped in two sets of curly braces.  There is no HTML escaping, so you have to trust the data you're running the template on.

See below for how to use the features of the templating engine.

Todo
----
1. Inverse conditionals (*not* something, ^ syntax)
2. Scope shifting conditionals (probably using !# syntax)
3. Safe html escaping (for the scaredycats)
4. Being able to iterate over collections of primitive objects ([1,2,3,4] or some such)

Features
========
Basic Properties
----------------
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
Nested Properties
-----------------
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
Functions
---------
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
Conditionals
------------
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
Loops
-----
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
