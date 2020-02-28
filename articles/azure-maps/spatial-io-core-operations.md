

# Core IO operations

In addition to providing tools for reading spatial data files, the spatial IO module also exposes some core underlying libraries that make it easy to read and write XML and delimited data fast and efficiently. 

The `atlas.io.core` namespace contains two low level classes that can quickly read and write CSV and XML data. These are the bases classes that powers the spatial data readers and writers in this module. Feel free to use these to add support for additional CSV or XML formats. 
 
## Read delimited files

The `atlas.io.core.CsvReader` class makes it easy to read strings that contain delimited data sets. 
By default the reader will use commas as delimiters, however this can be changed to any single character or set to `auto`.  
When set to `'auto'` the first line of text in the string will be analyized to find the most common character choosen from comma (`','`), tab (`'\t'`), or pipe (`'|'`) to use as the delimiter.
This reader also supports text qualifiers that are used to handle cells that contain the delimiter character. 
The quote (`'"'`) character is the default text qualifier, but can also be changed to any single character.

This class provides two methods for reading data:

- The `read` function will read the full data set and return a 2-dimensional array of strings representing all cells of the delimited data set.
- The `getNextRow` function reads each line of text in a delimited data set and returns an array of string representing all cells in that line of data set. This method can be much more memory efficient.

## Write delimited files

The `atlas.io.core.CsvWriter` class makes it easy to write an array of objects as a delimited string efficiently. 
Any single character can be used as a delimiter or text qualifier. 
The default delimiter is comma (`','`) and the default text qualifier is the quote (`'"'`) character.

The steps to use this class consist of the following:

- Create an instance of the class and optionally set a custom delimiter or text qualifier.
- Write data to the class by passing in either a 2-dimensional array of objects representing multiple rows and cells into the `write` function, or pass an array of objects representing a row of data with multiple columns into the `writeRow` function. 
- Call the `toString` function to retrieve the delimited string. 
- Optionally call the `clear` method to make the writer reusable and reduce its resource allocation, or simple delete the instance of writer to dispose of it.

Note: The number of columns written will be constrained to the number of cells in the first row of data passed into the writer.

## Read XML files

The `atlas.io.core.SimpleXmlReader` class is significantly faster at parsing XML files than `DOMParser`, however it requires XML files to be well formatted. XML files that are not well formatted, for example missing closing tags, will likely result in an error. 

The following code demonstrates how to use the `SimpleXmlReader` class to parse an XML string into a JSON object and serialize it into a desired format.

```javascript
//Create an instance of the SimpleXmlReader and parse an XML string into a JSON object.
var xmlDoc = new atlas.io.core.SimpleXmlReader().parse(xmlStringToParse);

//Verify that the root XML tag name of the document is the file type your code is designed to parse.
if (xmlDoc && xmlDoc.root && xmlDoc.root.tagName && xmlDoc.root.tagName === '<Your desired root XML tag name>') {

	var node = xmlDoc.root;

	//Loop through the child node tree to navigate through the parsed XML object.
	for (var i = 0, len = node.childNodes.length; i < len; i++) {
		childNode = node.childNodes[i];

		switch (childNode.tagName) {
			//Look for tag names, parse and serialized as desired.
		}
	}
}
```

## Write XML files

The `atlas.io.core.SimpleXmlWriter` class makes it easy to write well formatted XML in a memory efficient way. 

The following code demonstrates how to use the `SimpleXmlWriter` class to generate a well formatted XML string easily.

```javascript
//Create an instance of the SimpleXmlWriter class.
var writer = new atlas.io.core.SimpleXmlWriter();

//Start writing the document. All write functions return a reference to the writer, making it easy to simply chain the function calls to reduce repreative code.
writer.writeStartDocument(true)
	.writeStartElement('root', {	//Specify the root XML tag name, in this case 'root'
		//Attributes to add to the root XML tag.
		'version': '1.0',
		'xmlns': 'http://www.example.com',
		'xmlns:abc': 'http://www.example.com/abc'	//Example of a namespace.
	});

//Start writing an element that has the namespace abc and add other XML elements as children.
 writer.writeStartElement('abc:parent');
			
//Write a simple XML element like <title>Azure Maps is awesome!</title>
writer.writeElement('title', 'Azure Maps is awesome!');

//Close the element that we have been writting children to.
writer.writeEndElement();

//Finish writing the document by closing the root tag and the document.
writer.writeEndElement().writeEndDocument();

//Get the generated XML string from the writer.
var xmlString = writer.toString();
```

The generated XML from the above code would look like the following.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<root version="1.0" xmlns="http://www.example.com" xmlns:abc="http://www.example.com/abc">
	<abc:parent>
		<title>Azure Maps is awesome!</title>
	</abc:parent>
</root>
```

## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [CsvReader](https://docs.microsoft.com/javascript/api/azure-maps-spatial-io/atlas.io.core.csvreader)

> [!div class="nextstepaction"]
> [CsvWriter](https://docs.microsoft.com/javascript/api/azure-maps-spatial-io/atlas.io.core.csvwriter)

> [!div class="nextstepaction"]
> [SimpleXmlReader](https://docs.microsoft.com/javascript/api/azure-maps-spatial-io/atlas.io.core.simplexmlreader)

> [!div class="nextstepaction"]
> [SimpleXmlWriter](https://docs.microsoft.com/javascript/api/azure-maps-spatial-io/atlas.io.core.simplexmlwriter)

See the following articles for more code samples to add to your maps:

> [!div class="nextstepaction"]
> [Supported data format details](spatial-io-supported-data-format-details.md)