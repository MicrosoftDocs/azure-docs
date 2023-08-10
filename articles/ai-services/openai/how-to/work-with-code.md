---
title: 'How to use the Codex models to work with code'
titleSuffix: Azure OpenAI Service
description: Learn how to use the Codex models on Azure OpenAI to handle a variety of coding tasks
services: cognitive-services
manager: nitinme
ms.service: cognitive-services
ms.subservice: openai
ms.topic: how-to
ms.date: 06/24/2022
author: ChrisHMSFT
ms.author: chrhoder
keywords: 
---

# Codex models and Azure OpenAI Service

The Codex model series is a descendant of our GPT-3 series that's been trained on both natural language and billions of lines of code. It's most capable in Python and proficient in over a dozen languages including C#, JavaScript, Go, Perl, PHP, Ruby, Swift, TypeScript, SQL, and even Shell.

You can use Codex for a variety of tasks including:

- Turn comments into code
- Complete your next line or function in context
- Bring knowledge to you, such as finding a useful library or API call for an application
- Add comments
- Rewrite code for efficiency

## How to use the Codex models

Here are a few examples of using Codex that can be tested in [Azure OpenAI Studio's](https://oai.azure.com) playground with a deployment of a Codex series model, such as `code-davinci-002`.

### Saying "Hello" (Python)

```python
"""
Ask the user for their name and say "Hello"
"""
```

### Create random names (Python)

```python
"""
1. Create a list of first names
2. Create a list of last names
3. Combine them randomly into a list of 100 full names
"""
```

### Create a MySQL query (Python)

```python
"""
Table customers, columns = [CustomerId, FirstName, LastName, Company, Address, City, State, Country, PostalCode, Phone, Fax, Email, SupportRepId]
Create a MySQL query for all customers in Texas named Jane
"""
query =
```

### Explaining code (JavaScript)

```javascript
// Function 1
var fullNames = [];
for (var i = 0; i < 50; i++) {
  fullNames.push(names[Math.floor(Math.random() * names.length)]
    + " " + lastNames[Math.floor(Math.random() * lastNames.length)]);
}

// What does Function 1 do?
```

## Best practices

### Start with a comment, data or code

You can experiment using one of the Codex models in our playground (styling instructions as comments when needed.)

To get Codex to create a useful completion, it's helpful to think about what information a programmer would need to perform a task. This could simply be a clear comment or the data needed to write a useful function, like the names of variables or what class a function handles.

In this example we tell Codex what to call the function and what task it's going to perform.

```python
# Create a function called 'nameImporter' to add a first and last name to the database
```

This approach scales even to the point where you can provide Codex with a comment and an example of a database schema to get it to write useful query requests for various databases. Here's an example where we provide the columns and table names for the query.

```python
# Table albums, columns = [AlbumId, Title, ArtistId]
# Table artists, columns = [ArtistId, Name]
# Table media_types, columns = [MediaTypeId, Name]
# Table playlists, columns = [PlaylistId, Name]
# Table playlist_track, columns = [PlaylistId, TrackId]
# Table tracks, columns = [TrackId, Name, AlbumId, MediaTypeId, GenreId, Composer, Milliseconds, Bytes, UnitPrice]

# Create a query for all albums with more than 10 tracks
```

When you show Codex the database schema, it's able to make an informed guess about how to format a query.

### Specify the programming language

Codex understands dozens of different programming languages. Many share similar conventions for comments, functions and other programming syntax. By specifying the language and what version in a comment, Codex is better able to provide a completion for what you want. That said, Codex is fairly flexible with style and syntax. Here's an example for R and Python.

```r
# R language
# Calculate the mean distance between an array of points
```

```python
# Python 3
# Calculate the mean distance between an array of points
```

### Prompt Codex with what you want it to do

If you want Codex to create a webpage, placing the first line of code in an HTML document (`<!DOCTYPE html>`) after your comment tells Codex what it should do next. The same method works for creating a function from a comment (following the comment with a new line starting with func or def).

```html
<!-- Create a web page with the title 'Kat Katman attorney at paw' -->
<!DOCTYPE html>
```

Placing `<!DOCTYPE html>` after our comment makes it very clear to Codex what we want it to do.

Or if we want to write a function we could start the prompt as follows and Codex will understand what it needs to do next.

```python
# Create a function to count to 100

def counter
```

### Specifying libraries will help Codex understand what you want

Codex is aware of a large number of libraries, APIs and modules. By telling Codex which ones to use, either from a comment or importing them into your code, Codex will make suggestions based upon them instead of alternatives.

```html
<!-- Use A-Frame version 1.2.0 to create a 3D website -->
<!-- https://aframe.io/releases/1.2.0/aframe.min.js -->
```

By specifying the version, you can make sure Codex uses the most current library.

> [!NOTE]
> Codex can suggest helpful libraries and APIs, but always be sure to do your own research to make sure that they're safe for your application.

### Comment style can affect code quality

With some languages, the style of comments can improve the quality of the output. For example, when working with Python, in some cases using doc strings (comments wrapped in triple quotes) can give higher quality results than using the pound (`#`) symbol.

```python
"""
Create an array of users and email addresses
"""
```

### Comments inside of functions can be helpful

Recommended coding standards usually suggest placing the description of a function inside the function. Using this format helps Codex more clearly understand what you want the function to do.

```python
def getUserBalance(id):
    """
    Look up the user in the database ‘UserData' and return their current account balance.
    """
```

### Provide examples for more precise results

If you have a particular style or format you need Codex to use, providing examples or demonstrating it in the first part of the request will help Codex more accurately match what you need.

```python
"""
Create a list of random animals and species
"""
animals  = [ {"name": "Chomper", "species": "Hamster"}, {"name":
```

### Lower temperatures give more precise results

Setting the API temperature to 0, or close to zero (such as 0.1 or 0.2) tends to give better results in most cases. Unlike GPT-3 models, where a higher temperature can provide useful creative and random results, higher temperatures with Codex models may give you really random or erratic responses.

In cases where you need Codex to provide different potential results, start at zero and then increment upwards by 0.1 until you find suitable variation.

### Organize tasks into functions

We can get Codex to write functions by specifying what the function should do in as precise terms as possible in comment. For example, by writing the following comment, Codex creates a JavaScript timer function that's triggered when a user presses a button:

A simple JavaScript timer

```javascript
// Create a timer that creates an alert in 10 seconds
```

### Creating example data

Testing applications often requires using example data. Because Codex is a language model that understands how to comprehend and write natural language, you can ask Codex to create data like arrays of made up names, products and other variables. For example, here we ask Codex to create an array of weather temperatures.

```javascript
/* Create an array of weather temperatures for San Francisco */
```

Asking Codex to perform this task will produce a table like this:

```javascript
var weather = [
  { month: 'January', high: 58, low: 48 },
  { month: 'February', high: 61, low: 50 },
  { month: 'March', high: 64, low: 53 },
  { month: 'April', high: 67, low: 55 },
  { month: 'May', high: 70, low: 58 },
  { month: 'June', high: 73, low: 61 },
  { month: 'July', high: 76, low: 63 },
  { month: 'August', high: 77, low: 64 },
  { month: 'September', high: 76, low: 63 },
  { month: 'October', high: 73, low: 61 },
  { month: 'November', high: 68, low: 57 },
  { month: 'December', high: 64, low: 54 }
];
```

### Compound functions and small applications

We can provide Codex with a comment consisting of a complex request like creating a random name generator or performing tasks with user input and Codex can generate the rest provided there are enough tokens.

```javascript
/*
Create a list of animals
Create a list of cities
Use the lists to generate stories about what I saw at the zoo in each city
*/
```

### Limit completion size for more precise results or lower latency

Requesting longer completions in Codex can lead to imprecise answers and repetition. Limit the size of the query by reducing max_tokens and setting stop tokens. For instance, add `\n` as a stop sequence to limit completions to one line of code. Smaller completions also incur less latency.

### Use streaming to reduce latency

Large Codex queries can take tens of seconds to complete. To build applications that require lower latency, such as coding assistants that perform autocompletion, consider using streaming. Responses will be returned before the model finishes generating the entire completion. Applications that need only part of a completion can reduce latency by cutting off a completion either programmatically or by using creative values for `stop`.

Users can combine streaming with duplication to reduce latency by requesting more than one solution from the API, and using the first response returned. Do this by setting `n > 1`. This approach consumes more token quota, so use carefully (for example, by using reasonable settings for `max_tokens` and `stop`).

### Use Codex to explain code

Codex's ability to create and understand code allows us to use it to perform tasks like explaining what the code in a file does. One way to accomplish this is by putting a comment after a function that starts with "This function" or "This application is." Codex will usually interpret this as the start of an explanation and complete the rest of the text.

```javascript
/* Explain what the previous function is doing: It
```

### Explaining an SQL query

In this example, we use Codex to explain in a human readable format what an SQL query is doing.

```sql
SELECT DISTINCT department.name
FROM department
JOIN employee ON department.id = employee.department_id
JOIN salary_payments ON employee.id = salary_payments.employee_id
WHERE salary_payments.date BETWEEN '2020-06-01' AND '2020-06-30'
GROUP BY department.name
HAVING COUNT(employee.id) > 10;
-- Explanation of the above query in human readable format
--
```

### Writing unit tests

Creating a unit test can be accomplished in Python simply by adding the comment "Unit test" and starting a function.

```python
# Python 3
def sum_numbers(a, b):
  return a + b

# Unit test
def
```

### Checking code for errors

By using examples, you can show Codex how to identify errors in code. In some cases no examples are required, however demonstrating the level and detail to provide a description can help Codex understand what to look for and how to explain it. (A check by Codex for errors shouldn't replace careful review by the user. )

```javascript
/* Explain why the previous function doesn't work. */
```

### Using source data to write database functions

Just as a human programmer would benefit from understanding the database structure and the column names, Codex can use this data to help you write accurate query requests. In this example, we insert the schema for a database and tell Codex what to query the database for.

```python
# Table albums, columns = [AlbumId, Title, ArtistId]
# Table artists, columns = [ArtistId, Name]
# Table media_types, columns = [MediaTypeId, Name]
# Table playlists, columns = [PlaylistId, Name]
# Table playlist_track, columns = [PlaylistId, TrackId]
# Table tracks, columns = [TrackId, Name, AlbumId, MediaTypeId, GenreId, Composer, Milliseconds, Bytes, UnitPrice]

# Create a query for all albums with more than 10 tracks
```

### Converting between languages

You can get Codex to convert from one language to another by following a simple format where you list the language of the code you want to convert in a comment, followed by the code and then a comment with the language you want it translated into.

```python
# Convert this from Python to R
# Python version

[ Python code ]

# End

# R version
```

### Rewriting code for a library or framework

If you want Codex to make a function more efficient, you can provide it with the code to rewrite followed by an instruction on what format to use.

```javascript
// Rewrite this as a React component
var input = document.createElement('input');
input.setAttribute('type', 'text');
document.body.appendChild(input);
var button = document.createElement('button');
button.innerHTML = 'Say Hello';
document.body.appendChild(button);
button.onclick = function() {
  var name = input.value;
  var hello = document.createElement('div');
  hello.innerHTML = 'Hello ' + name;
  document.body.appendChild(hello);
};

// React version:
```

## Next steps

Learn more about the [underlying models that power Azure OpenAI](../concepts/models.md).
