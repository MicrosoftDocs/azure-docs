---
title: Extract text from images
titleSuffix: Azure Cognitive Search
description: Use Optical Character Recognition (OCR) and image analysis to extract text, layout, captions, and tags from image files in Azure Cognitive Search pipelines.

author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: how-to
ms.date: 12/16/2021
ms.custom: devx-track-csharp
---

# Extract text and information from images in AI enrichment

Through [AI enrichment](cognitive-search-concept-intro.md), Azure Cognitive Search gives you several options for creating and extracting searchable text inside images, including:

+ [OCR](cognitive-search-skill-ocr.md) for optical character recognition of text and digits
+ [Image Analysis](cognitive-search-skill-image-analysis.md) that describe images through captions and tags
+ [Custom skills](#passing-images-to-custom-skills) to invoke any external image processing that you want to provide

Through OCR, you can extract text from photos or pictures containing alphanumeric text, such as the word "STOP" in a stop sign. Through image analysis, you can generate a text representation of an image, such as "dandelion" for a photo of a dandelion, or the color "yellow". You can also extract metadata about the image, such as its size.

This article explains how to work with images in an AI enrichment pipeline. To work with image content, you'll need:

+ Source files that include images
+ A search indexer, configured for image actions
+ A skillset with built-in or custom skills that invoke OCR or image analysis
+ A search index with fields to receive the analyzed text output, with output field mappings in the indexer that provide the association.

Optionally, you can define projections to accept analyzed output into a [knowledge store](knowledge-store-concept-intro.md) for data mining scenarios. 

## Source files

Image processing is indexer-driven, which means that the raw inputs must be a supported file type (as determined by the skills you choose) from a [supported data source](search-indexer-overview.md#supported-data-sources). OCR supports JPEG, PNG, GIF, TIF, and BMP. Image analysis supports JPEG, PNG, GIF, and BMP. Images can be binary files or embedded in documents (PDF, RTF, and Microsoft application files). Azure Blob Storage is the most frequently used storage for image processing in Cognitive Search. [Blob indexer configuration](search-howto-indexing-azure-blob-storage.md#how-to-control-which-blobs-are-indexed) includes file exclusion settings so that you can import files of a selected type.

Connections to source files is specified in an indexer data source object. As with any indexer, the connection will be made using either key-based authentication or Azure Active Directory and role-based authorization.

In addition to connections to external data, Cognitive Search makes calls to a billable Azure Cognitive Services resource for OCR and image analysis. Your skillset will need to include multi-service key to a Cognitive Services resource in the same region as your Cognitive Search service.

## Indexer configuration for image processing

Parameters in indexer configuration enable image processing:

+ imageAction (image normalization)
+ parsingMode

<a name="get-normalized-images"></a>

### Enable image normalization

Image processing requires image normalization to make images more uniform for downstream processing. This step occurs automatically and is internal to indexer processing. As a developer, your only action is to enable image normalization by setting the "imageAction" parameter in indexer configuration.

Image normalization includes the following operations:

+ Large images are resized to a maximum height and width to make them uniform and consumable during skillset processing.
+ For images that have metadata on orientation, image rotation is adjusted for vertical loading. Metadata adjustments are captured in a complex type created for each image. 

You cannot turn off image normalization. Skills that iterate over images, such as OCR and image analysis, expect normalized images.

| Configuration Parameter | Description |
|-------------------------|-------------|
| imageAction	| Set to "none" if no action should be taken when embedded images or image files are encountered. </p>Set to "generateNormalizedImages" to generate an array of normalized images as part of document cracking. </p>Set to "generateNormalizedImagePerPage" to generate an array of normalized images where, for PDFs in your data source, each page is rendered to one output image.  The functionality is the same as "generateNormalizedImages" for non-PDF file types. </p>For any option that is not "none", the images will be exposed in the *normalized_images* field. </p>The default is "none." This configuration is only pertinent to blob data sources, when "dataToExtract" is set to "contentAndMetadata". </p>A maximum of 1000 images will be extracted from a given document. If there are more than 1000 images in a document, the first 1000 will be extracted and a warning will be generated. |
|  normalizedImageMaxWidth | The maximum width (in pixels) for normalized images generated. The default is 2000. The maximum value allowed is 10000. | 
|  normalizedImageMaxHeight | The maximum height (in pixels) for normalized images generated. The default is 2000. The maximum value allowed is 10000.|

The default of 2000 pixels for the normalized images maximum width and height is based on the maximum sizes supported by the [OCR skill](cognitive-search-skill-ocr.md) and the [image analysis skill](cognitive-search-skill-image-analysis.md). The [OCR skill](cognitive-search-skill-ocr.md) supports a maximum width and height of 4200 for non-English languages, and 10000 for English.  If you increase the maximum limits, processing could fail on larger images depending on your skillset definition and the language of the documents. 

You specify the imageAction in the parameters configuration section of the [indexer definition](/rest/api/searchservice/create-indexer) as follows:

```json
{
  "parameters":
  {
    "configuration": 
    {
    	"dataToExtract": "contentAndMetadata",
     	"imageAction": "generateNormalizedImages"
    }
  }
}
```

When "imageAction" is set to a value other then "none", the new *normalized_images* field will contain an array of images. Each  image is a complex type that has the following members:

| Image member       | Description                             |
|--------------------|-----------------------------------------|
| data               | BASE64 encoded string of the normalized image in JPEG format.   |
| width              | Width of the normalized image in pixels. |
| height             | Height of the normalized image in pixels. |
| originalWidth      | The original width of the image before normalization. |
| originalHeight      | The original height of the image before normalization. |
| rotationFromOriginal |  Counter-clockwise rotation in degrees that occurred to create the normalized image. A value between 0 degrees and 360 degrees. This step reads the metadata from the image that is generated by a camera or scanner. Usually a multiple of 90 degrees. |
| contentOffset | The character offset within the content field where the image was extracted from. This field is only applicable for files with embedded images. |
| pageNumber | If the image was extracted or rendered from a PDF, this field contains the page number in the PDF it was extracted or rendered from, starting from 1.  If the image was not from a PDF, this field will be 0.  |

 Sample value of *normalized_images*:

```json
[
  {
    "data": "BASE64 ENCODED STRING OF A JPEG IMAGE",
    "width": 500,
    "height": 300,
    "originalWidth": 5000,  
    "originalHeight": 3000,
    "rotationFromOriginal": 90,
    "contentOffset": 500,
    "pageNumber": 2
  }
]
```

### Check the parsingMode (Blob storage only)

Blob indexers include a "parsingMode" parameter that determines the granularity of search documents created in the index. The default mode sets up a one-to-one correspondence so that one blob results in one search document, but it also accepts values that result in one blob and many search documents. 

Whenever you invoke OCR or image analysis, the parsing mode must be "default". Parsing applies to text, not images, but if indexer configuration includes "imageAction" set to anything other than "none", then the "parsingMode" must be "default".

> [!NOTE]
> The parsing mode applies equally to all files in the container. If the container contains text-only files that you want to parse using another mode, such as JSON or JSON arrays, you will need to place those files into a separate container and set up a second indexer with the appropriate configuration.

## Define a skillset

This section supplements the [skill reference](cognitive-search-predefined-skills.md) articles by providing a holistic introduction to skill inputs, outputs, and patterns, as they relate to image processing.

### Inputs for image processing

As noted, images are extracted during document cracking and then normalized as a preliminary step. The normalized images are the inputs to any image processing skill, and are always represented in an enriched document tree in either one of two ways:

+ `"/document/normalized_images/*"` is for documents that are processed whole
+ `"/document/normalized_images/*/pages"` is for documents that are processed in chunks (pages)

Whether you're using OCR and image analysis in the same, inputs have virtually the same construction:

```json
    {
      "@odata.type": "#Microsoft.Skills.Vision.OcrSkill",
      "context": "/document/normalized_images/*",
      "detectOrientation": true,
      "inputs": [
        {
          "name": "image",
          "source": "/document/normalized_images/*"
        }
      ],
      "outputs": [ ]
    },
    {
      "@odata.type": "#Microsoft.Skills.Vision.ImageAnalysisSkill",
      "context": "/document/normalized_images/*",
      "visualFeatures": [ "tags", "description" ],
      "inputs": [
        {
          "name": "image",
          "source": "/document/normalized_images/*"
        }
      ],
      "outputs": [ ]
    }
```

### Expected output

Output is always text, represented as nodes in an internal enriched document tree, which must be mapped to fields in a search index or projections in a knowledge store to make the content available in your app. The "outputs" section of a skill tells you what content gets created as nodes in the enriched document:

```json
{
  "@odata.type": "#Microsoft.Skills.Vision.OcrSkill",
  "context": "/document/normalized_images/*",
  "detectOrientation": true,
  "inputs": [ ],
  "outputs": [
    {
      "name": "text",
      "targetName": "text"
    },
    {
      "name": "layoutText",
      "targetName": "layoutText"
    }
  ]
}
```

Enriched documents are internal. To "externalize" their nodes, you'll create an output field mapping to a data structure that can be used by your app. Below is an example of a "text" node (OCR output) mapped to a "text" field in a search index. Output field mappings are made in the indexer configuration.

```json
  "outputFieldMappings": [
    {
      "sourceFieldName": "/document/normalized_images/*/text",
      "targetFieldName": "text"
    }
  ]
```

Skill outputs include "text" (OCR), "layoutText" (OCR), "merged_content", "captions" (image analysis), "tags" (image analysis):

+ `"text"` stores OCR-generated output. This node is mapped to field of type `Collection(Edm.String)`. There is one "text" field per search document consisting of comma-delimited strings for documents that contain multiple images. The following illustration shows OCR output for three documents. First is a document containing one image with no text. Second is a document containing one image  with the word "Microsoft". Third is a document containing multiple images, some with without any text (`"",`).

    ```json
    "value": [
        {
            "@search.score": 1,
            "metadata_storage_name": "facts-about-microsoft.html",
            "text": []
        },
        {
            "@search.score": 1,
            "metadata_storage_name": "guthrie.jpg",
            "text": [ "Microsoft" ]
        },
        {
            "@search.score": 1,
            "metadata_storage_name": "Cognitive Services and Content Intelligence.pptx",
            "text": [
                "",
                "Microsoft",
                "",
                "",
                "",
                "Cognitive Search and Augmentation Combining Microsoft Cognitive Services and Azure Search"
            ]
        }
    ]
    ```

+ `"layoutText"` stores OCR-generated information about text location on the page, described in terms of bounding boxes and coordinates of the normalized image. This node is mapped to field of type `Collection(Edm.String)`. There is one "layoutText" field per search document consisting of comma-delimited strings.

+ `"merged_content"` stores the output of a Text Merge skill, and it will be one large field of type `Edm.String` that contains raw text from the source document, with embedded "text" in place of an image. If files are text-only, then OCR and image analysis have nothing to do, and "merged_content" will be the same as "content" (a blob property that contains the content of the blob).

+ `"ImageCaption"` captures a description of an image as individuals tags and a longer text description.

+ `"ImageTags"` stores tags about an image as a collection of keywords, one collection for all images in the source document. The example below demonstrates that tags will repeat. There is no aggregation or grouping.

For the following embedded images in a PDF:

:::image type="content" source="media/cognitive-search-concept-image-scenarios/state-of-birds-screenshot.png" alt-text="Screenshot of three images in a PDF" border="true":::

Output from image analysis includes a caption for each image, while tags are listed in the order of creation:

```json
 "imageCaption": [
      "{\"tags\":[\"bird\",\"outdoor\",\"water\",\"flock\",\"many\",\"lot\",\"bunch\",\"group\",\"several\",\"gathered\",\"pond\",\"lake\",\"different\",\"family\",\"flying\",\"standing\",\"little\",\"air\",\"beach\",\"swimming\",\"large\",\"dog\",\"landing\",\"jumping\",\"playing\"],\"captions\":[{\"text\":\"a flock of seagulls are swimming in the water\",\"confidence\":0.70419257326275686}]}",
      "{\"tags\":[\"map\"],\"captions\":[{\"text\":\"map\",\"confidence\":0.99942880868911743}]}",
      "{\"tags\":[\"animal\",\"bird\",\"raptor\",\"eagle\",\"sitting\",\"table\"],\"captions\":[{\"text\":\"a close up of a bird\",\"confidence\":0.89643581933539462}]}",
    . . .

 "imageTags": [
    "bird",
    "outdoor",
    "water",
    "flock",
    "animal",
    "bunch",
    "group",
    "several",
    "drink",
    "gathered",
    "pond",
    "different",
    "family",
    "same",
    "map",
    "text",
    "animal",
    "bird",
    "bird of prey",
    "eagle"
    . . .
```

## Use custom image skills

Images can also be passed into and returned from custom skills. The skillset base64-encodes the image being passed into the custom skill. To use the image within the custom skill, set `"/document/normalized_images/*/data"` as the input to the custom skill. Within your custom skill code, base64-decode the string before converting it to an image. To return an image to the skillset, base64-encode the image before returning it to the skillset.

 The image is returned as an object with the following properties.

```json
 { 
  "$type": "file", 
  "data": "base64String" 
 }
```

The [Azure Search python samples](https://github.com/Azure-Samples/azure-search-python-samples) repository has a complete sample implemented in Python of a custom skill that enriches images.

## Processing embedded images in PDF and other files

When you run OCR over source files that included documents with embedded images, the output is a single string containing all file contents, both text and image-origin text, achieved with this workflow:  

1. The indexer cracks source documents, extracts text and images, and queues each content type for text and image processing.
1. Images are normalized and passed into enriched documents as a [`"document/normalized_images"`](#get-normalized-images) node.
1. OCR runs using `"/document/normalized_images"` as input.
1. [Text Merge](cognitive-search-skill-textmerger.md) runs, combining the text representation of those images with the raw text extracted from the file. Text chunks are consolidated into a single large string.
1. Indexers reference output field mappings to send skill outputs to fields in a search index.

The following example skillset creates a "merged_text" field containing the textual content of your document. It also includes the OCRed text from each of the embedded images. 

### Request body syntax

```json
{
  "description": "Extract text from images and merge with content text to produce merged_text",
  "skills":
  [
    {
        "description": "Extract text (plain and structured) from image.",
        "@odata.type": "#Microsoft.Skills.Vision.OcrSkill",
        "context": "/document/normalized_images/*",
        "defaultLanguageCode": "en",
        "detectOrientation": true,
        "inputs": [
          {
            "name": "image",
            "source": "/document/normalized_images/*"
          }
        ],
        "outputs": [
          {
            "name": "text"
          }
        ]
    },
    {
      "@odata.type": "#Microsoft.Skills.Text.MergeSkill",
      "description": "Create merged_text, which includes all the textual representation of each image inserted at the right location in the content field.",
      "context": "/document",
      "insertPreTag": " ",
      "insertPostTag": " ",
      "inputs": [
        {
          "name":"text", "source": "/document/content"
        },
        {
          "name": "itemsToInsert", "source": "/document/normalized_images/*/text"
        },
        {
          "name":"offsets", "source": "/document/normalized_images/*/contentOffset" 
        }
      ],
      "outputs": [
        {
          "name": "mergedText", "targetName" : "merged_text"
        }
      ]
    }
  ]
}
```

Now that you have a merged_text field, you could map it as a searchable field in your indexer definition. All of the content of your files, including the text of the images, will be searchable.

## Visualize bounding boxes of extracted text

Another common scenario is visualizing search results layout information. For example, you might want to highlight where a piece of text was found in an image as part of your search results.

Since the OCR step is performed on the normalized images, the layout coordinates are in the normalized image space. When displaying the normalized image, the presence of coordinates is generally not a problem, but in some situations you might want to display the original image. In this case, convert each of coordinate points in the layout to the original image coordinate system. 

As a helper, if you need to transform normalized coordinates to the original coordinate space, you could use the following algorithm:

```csharp
/// <summary>
///  Converts a point in the normalized coordinate space to the original coordinate space.
///  This method assumes the rotation angles are multiples of 90 degrees.
/// </summary>
public static Point GetOriginalCoordinates(Point normalized,
                            int originalWidth,
                            int originalHeight,
                            int width,
                            int height,
                            double rotationFromOriginal)
{
    Point original = new Point();
    double angle = rotationFromOriginal % 360;

    if (angle == 0 )
    {
        original.X = normalized.X;
        original.Y = normalized.Y;
    } else if (angle == 90)
    {
        original.X = normalized.Y;
        original.Y = (width - normalized.X);
    } else if (angle == 180)
    {
        original.X = (width -  normalized.X);
        original.Y = (height - normalized.Y);
    } else if (angle == 270)
    {
        original.X = height - normalized.Y;
        original.Y = normalized.X;
    }

    double scalingFactor = (angle % 180 == 0) ? originalHeight / height : originalHeight / width;
    original.X = (int) (original.X * scalingFactor);
    original.Y = (int)(original.Y * scalingFactor);

    return original;
}
```

## Passing images to custom skills

For scenarios where you require a custom skill to work on images, you can pass images to the custom skill, and have it return text or images. The [Python sample](https://github.com/Azure-Samples/azure-search-python-samples/tree/master/Image-Processing) image-processing demonstrates the workflow. The following skillset is from the sample.

The following skillset takes the normalized image (obtained during document cracking), and outputs slices of the image.

### Sample skillset

```json
{
  "description": "Extract text from images and merge with content text to produce merged_text",
  "skills":
  [
    {
          "@odata.type": "#Microsoft.Skills.Custom.WebApiSkill",
          "name": "ImageSkill",
          "description": "Segment Images",
          "context": "/document/normalized_images/*",
          "uri": "https://your.custom.skill.url",
          "httpMethod": "POST",
          "timeout": "PT30S",
          "batchSize": 100,
          "degreeOfParallelism": 1,
          "inputs": [
            {
              "name": "image",
              "source": "/document/normalized_images/*"
            }
          ],
          "outputs": [
            {
              "name": "slices",
              "targetName": "slices"
            }
          ],
          "httpHeaders": {}
        }
  ]
}
```

### Custom skill

The custom skill itself is external to the skillset. In this case, it is Python code that first loops thorough the batch of request records in the custom skill format, then converts the base64-encoded string to an image.

```python
# deserialize the request, for each item in the batch
for value in values:
  data = value['data']
  base64String = data["image"]["data"]
  base64Bytes = base64String.encode('utf-8')
  inputBytes = base64.b64decode(base64Bytes)
  # Use numpy to convert the string to an image
  jpg_as_np = np.frombuffer(inputBytes, dtype=np.uint8)
  # you now have an image to work with
```

Similarly to return an image, return a base64 encoded string within a JSON object with a `$type` property of `file`.

```python
def base64EncodeImage(image):
    is_success, im_buf_arr = cv2.imencode(".jpg", image)
    byte_im = im_buf_arr.tobytes()
    base64Bytes = base64.b64encode(byte_im)
    base64String = base64Bytes.decode('utf-8')
    return base64String

 base64String = base64EncodeImage(jpg_as_np)
 result = { 
  "$type": "file", 
  "data": base64String 
}
```

## See also

+ [Create indexer (REST)](/rest/api/searchservice/create-indexer)
+ [Image Analysis skill](cognitive-search-skill-image-analysis.md)
+ [OCR skill](cognitive-search-skill-ocr.md)
+ [Text merge skill](cognitive-search-skill-textmerger.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
+ [How to map enriched fields](cognitive-search-output-field-mapping.md)
+ [How to pass images to custom skills](https://github.com/Azure-Samples/azure-search-python-samples/tree/master/Image-Processing)
