---
title: Form Recognizer analyze document API response
titleSuffix: Azure Applied AI Services
description: Description of the different objects returned as part of the analyze document API response and how to use the document analysis response in your applications.
author: laujan
manager: netahw
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 03/08/2023
ms.author: vikurpad
recommendations: false
---

# Analyze document API response

Form Recognizer analyzes images, PDFs, and other document files to extract and detect various content, layout, style, and semantic elements. The analyze operation is an async API, submitting a document returns a operation location header, that contains the URL to poll for completion. When a analysis request completes successfully, the response contains the the elements described in the [model data extraction](concept-model-overview.md#model-data-extraction).

Content elements are the basic components that make up a document.  Layout elements groups content elements into structural units.  Style elements describe the font and language of content elements.  Semantic elements assign meaning to the specified elements.

All content elements are grouped by pages, specified by its page number (1-indexed).  They are also sorted by reading order that arranges semantically contiguous elements together, even if they cross line, column or page boundaries.  When the reading order among paragraphs and other layout elements is ambiguous, the service generally returns the content in a left-to-right, top-to-bottom order.

> [!NOTE]
> Current Form Recognizer does not support reading order across page boundaries.  Selection marks are not interleaved within the surrounding words.

The top-level content property contains a concatenation of all content elements in reading order.  All elements specify their position in the reader order via spans into this content string.  Note that the content of some elements may not be contiguous.

## Analyze response

The analyze response for each API returns different objects. API responses contain elements from component models where applicable.

| Response content | Description | API |
|--|--|--|
| pages| Words, lines and spans recognized from each page of the input document | Read, Layout, General Document, Prebuilt models and Custom models| 
| paragraphs| The content recognized by paragraphs | Read, Layout, General Document, Prebuilt models and Custom models| 
| styles| Text element properties identified | Read, Layout, General Document, Prebuilt models and Custom models| 
| languages| The identified language associated with each span of the text extracted | Read |
| tables| Tables identified and extracted from the document. Note that tables only relates to tables identified by the pre trained layout model. Content labled as tables are extracted as structured fields in the documents object  | Layout, General Document, **Some** Prebuilt models and Custom models | 
| keyvaluepairs| Key value pairs recognized by the pre trained model. The key is a span of text from the document with the associated value | General document, Invoice |
| documents| Fields recognized are returned in the ```fields``` dictionary within the list of documents| Prebuilt models, Custom models|

For more information on the objects retured by each API, see [model data extraction](concept-model-overview.md#model-data-extraction).

## Element properties

### Spans

Spans specify the logical position of each element in the overall reading order, with each span specifying a character offset and length into the top-level content string property.  By default, character offsets and lengths are returned in units of user-perceived characters (also known as grapheme clusters or text elements).  To accommodate different development environments, which use different character units, user can specify the stringIndexIndex query parameter to return span offsets and lengths in Unicode code points (Python 3) or UTF16 code units (Java, JavaScript, .NET) as well.  See [multilingual/emoji support](../../cognitive-services/language-service/concepts/multilingual-emoji-support.md) for more details.

### Bounding Region

Bounding regions describe the visual position of each element in the file.  As an element may not be visually contiguous (ex. entities) or may cross pages (ex. tables), the position of most elements are described via an array of bounding regions, where each region specifies the page number (1-indexed) and bounding polygon.  The bounding polygon is described as a sequence of points, clockwise from the left relative to the natural orientation of the element.  For quadrilaterals, this would be the top-left, top-right, bottom-right, and bottom-left corners.  Each point is represented by its x, y coordinate in the page unit specified by the unit property.  In general, unit of measure for images is pixels while PDFs use inches.

:::image type="content" source="media/bounding-regions.png" alt-text="Bounding regions":::

> [!NOTE]
> Current Form Recognizer only returns 4-vertex quadrilaterals as bounding polygons.  Future versions may return different number of points to describe more complex shapes, such as curved lines or non-rectangular images. Bounding regions applied only to rendered files, if the file is not rendered, bounding regions are not returned. Currently files of docx/xlsx/pptx/html format are not rendered.

### Content elements

#### Word

A word is a content element composed of a sequence of characters.  In Form Recognizer, a word is generally defined as a sequence of adjacent characters, with whitespace separating words from one another.  For languages that do not use space separators between words (ex. Chinese, Japanese, Korean) each character is returned as a separate word, even if it does not represent a semantic word unit.

:::image type="content" source="media/word-boundaries.png" alt-text="Detected words":::

#### Selection marks

A selection mark is a content element that represents a visual glyph indicating the state of a selection.  Checkbox is a common form of selection marks.  However, they may also be represented via radio buttons or a boxed cell in a visual form.  The state of a selection mark may be selected or unselected, with different visual representation to indicate the state.

:::image type="content" source="media/selection-marks.png" alt-text="Selection marks":::

### Layout elements

#### Line

A line is an ordered sequence of consecutive content elements separated by a visual space, or ones that are immediately adjacent for languages without space delimiters between words.  Content elements in the same horizontal plane (ex. row) but separated by more than a single visual space will generally be split into multiple lines.  While this sometimes splits semantically contiguous content into separate lines, it enables the representation of textual content split into multiple columns or cells.  Lines in vertical writing will be detected in the vertical direction.

:::image type="content" source="media/lines.png" alt-text="Lines":::

#### Paragraph

A paragraph is an ordered sequence of lines that form a logical unit.  Typically, the lines share common alignment and spacing between lines.  Paragraphs are often delimited by indentation, additional spacing, or bullets/numbering.  Content can only be assigned to a single paragraph.
Select paragraphs may also be associated a with functional role in the document.  Currently supported roles include
* Page header
* Page footer
* Page number
* Title
* Section heading
* Footnote

:::image type="content" source="media/paragraphs.png" alt-text="Paragraphs":::

#### Page

A page is a grouping of content that typically corresponds to one side of a sheet of paper.  For rendered pages, it is characterized by width and height in the specified unit.  In general, images use pixel while PDFs use inch.  The angle property describes the overall text angle in degrees for pages that may be rotated.

> [!NOTE]
> For spreadsheets (ex. xslx), each sheet is mapped to a page.  For presentations (ex. pptx), each slide is mapped to a page.  For file formats without a native concept of pages without rendering (ex. html, docx), the main content of the file is considered a single page.

#### Table

A table organizes content into a group of cells in a grid layout.  The rows and columns may be visually separated by grid lines, color banding, or greater spacing.
The position of a table cell is specified by its row and column indices.  A cell may span across multiple rows and columns.

Based on its position and styling, a cell may be classified as general content, row header, column header, stub head, or description.  A row header cell is typically the first cell in a row that describe the other cells in the row.  Similarly, a column header cell is typically the first cell in a column that describes the other cells in a column.  A row/column may contain multiple header cells to describe hierarchical content.  A stub head cell is typically the cell in the first row and first column position.  It may be empty or describe the values in the header cells in the same row/column.  A description cell generally appears at the very top or bottom of a table, describing the overall table content.  However, it may sometimes appear in the middle of a table to break the table into sections.  Typically, description cells span across multiple cells in a single row. A table may further have an associated caption and a set of footnotes.  A table caption specifies content that explains the table.  Unlike a description cell, a caption typically lies outside the grid layout.  A table footnote annotates content inside the table, often marked with a footnote symbol.  It is often found below the table grid.

Layout tables differs from document fields extracted from tabular data.  Layout tables are extracted from tabular visual content in the document without considering the semantics of the content.  In fact, some layout tables are designed purely for visual layout and may not always contain structured data.  To extract structured data from documents with diverse visual layout (ex. itemized details of a receipt) generally requires significant postprocessing to map the row/column headers to structured fields with normalized field names.  Depending on the document type, use prebuilt models or train a custom model to extract such structured content.  The resulting information are exposed as document fields.  Such trained models can also handle tabular data without headers as well as structured data in non-tabular forms for example the work experience section of a resume.

:::image type="content" source="media/tables.png" alt-text="Layout tables":::

#### Form field (key value pair)

A form field consists of a field label (key) and value.  The field label is generally a descriptive text string describing the meaning of the field.  It often appears to the left of the value, though it can also appear above or below the value as well.  The field value contains the content value of a specific field instance.  The value may consist of words, selection marks, and other content elements.  It may also be empty for unfilled form fields.  A special type of form field has a selection mark value with the field label to its right.
Document field is a similar but distinct concept from general form fields.  The field label (key) in a general form field must appear in the document.  Thus, it cannot capture information like the merchant name in a receipt. Document fields are labeled and do not extract a key, document fields only map an extracted value to a labeled key. See [document fields](#document-fields) for additional details.

### Style elements

#### Style

A style element describes the font style to apply to text content.  The content is specified via spans into the global content property.  Currently, the only detected font style is whether the text is handwritten.  As other styles are added, text may be described by multiple non-conflicting style objects.  For compactness, all text sharing the particular font style (with the same confidence) are described via a single style object.

#### Language

A language element describes the detected language for content specified via spans into the global content property.  The detected language is specified via a [BCP-47 language tag](https://en.wikipedia.org/wiki/IETF_language_tag) to indicate the primary language and optional script and region information.  For example, English and traditional Chinese are recognized as "en" and "zh-Hant", respectively.  Regional spelling differences for UK English may lead the text to be detected as "en-GB".  Language elements do not cover text without a dominant language (ex. numbers).

### Semantic elements

#### Document

A document is a semantically complete unit.  A file may contain multiple documents, such as multiple tax forms within a PDF file, or multiple receipts within a single page.  The ordering of documents within the file does not affect the information it conveys.

> [!NOTE]
> Currently Form Recognizer does not support multiple documents on a single page or multiple documents within a file. <TODO Validate>

The document type describes documents sharing a common set of semantic fields, represented by a structured schema, independent of its visual template or layout.  For example, all documents of type "receipt" may contain the merchant name, transaction date, and transaction total, although restaurant and hotel receipts generally look completely different.

##### Document fields

A document element includes the list of recognized fields from among the fields specified by the semantic schema of the detected document type.  A document field may be extracted or inferred.  Extracted fields are represented by the extracted content and optionally its normalized value, if interpretable.  Inferred fields do not have content property and are represented only by its value.  Array fields do not include a content property, as the content can be concatenated from the content of the array elements.  Object fields do contain a content property that specifies the full content representing the object, which may be a superset of the extracted subfields.

The semantic schema of a document type is described by the fields it may contain.  Each field schema is specified by its canonical name and value type.  Field value types include basic (ex. string), compound (ex. address), and structured (ex. array, object) types.  The field value type also specifies the semantic normalization performed to convert detected content into a normalization representation.  Note that normalization may be locale dependent.

**Basic types**

| Field value type| Description | Normalized representation | Example (Field content -> Value) |
|--|--|--|--|
| string | Plain text | Same as content | MerchantName: "Contoso" → "Contoso" |
| date | Date | ISO 8601 - YYYY-MM-DD | InvoiceDate: "5/7/2022" → "2022-05-07" |
| time | Time | ISO 8601 - hh:mm:ss | TransactionTime: "9:45 PM" → "21:45:00" |
| phoneNumber | Phone number | E.164 - +{CountryCode}{SubscriberNumber} | WorkPhone: "(800) 555-7676" → "+18005557676"|
| countryRegion | Country/region | ISO 3166-1 alpha-3 | CountryRegion: "United States" → "USA" |
| selectionMark | Is selected | "signed" or "unsigned" | AcceptEula: ☑ → "selected" |
| signature | Is signed | Same as content | LendeeSignature: {signature} → "signed" |
| number | Floating point number | Floating point number | Quantity: "1.20" → 1.2|
| integer | Integer number | 64-bit signed number | Count: "123" → 123 |
| boolean | Boolean value | true/false | IsStatutoryEmployee: ☑ → true |

**Compound types** 

* Currency: Currency amount with optional currency unit. For example a value ```InvoiceTotal: $123.45```
    ```json
    {
        "amount": 123.45,  
        "currencySymbol": "$" 
    }
        ```
* Address: Parsed address. For example ```ShipToAddress: 123 Main St., Redmond, WA 98052```
```json
    {
    "poBox": "PO Box 12",
    "houseNumber": "123",
    "streetName": "Main St.",
    "city": "Redmond",
    "state": "WA",
    "postalCode": "98052",
    "countryRegion": "USA",
    "streetAddress": "123 Main St."
    }

```

**Structured types**

* Array: List of fields of the same type
* Tables: Document fields labeled as tables are extracted as an array of objects, where each element in the array corresponds to a row and each cell within that row is a key value pair with the column name being the key and the extracted content is the associated value.
