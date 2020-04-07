---
title: Extract text from images
titleSuffix: Azure Cognitive Search
description: Process and extract text and other information from images in Azure Cognitive Search pipelines.

manager: nitinme
author: LuisCabrer
ms.author: luisca
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 11/04/2019
---
# How to process and extract information from images in AI enrichment scenarios

Azure Cognitive Search has several capabilities for working with images and image files. During document cracking, you can use the *imageAction* parameter to extract text from photos or pictures containing alphanumeric text, such as the word "STOP" in a stop sign. Other scenarios include generating a text representation of an image, such as "dandelion" for a photo of a dandelion, or the color "yellow". You can also extract metadata about the image, such as its size.

This article covers image processing in more detail and provides guidance for working with images in an AI enrichment pipeline.

<a name="get-normalized-images"></a>

## Get normalized images

As part of document cracking, there are a new set of indexer configuration parameters for handling image files or images embedded in files. These parameters are used to normalize images for further downstream processing. Normalizing images makes them more uniform. Large images are resized to a maximum height and width to make them consumable. For images providing metadata on orientation, image rotation is adjusted for vertical loading. Metadata adjustments are captured in a complex type created for each image. 

You cannot turn off image normalization. Skills that iterate over images expect normalized images. Enabling image normalization on an indexer requires that a skillset be attached to that indexer.

| Configuration Parameter | Description |
|--------------------|-------------|
| imageAction	| Set to "none" if no action should be taken when embedded images or image files are encountered. <br/>Set to "generateNormalizedImages" to generate an array of normalized images as part of document cracking.<br/>Set to "generateNormalizedImagePerPage" to generate an array of normalized images where, for PDFs in your data source, each page is rendered to one output image.  The functionality is the same as "generateNormalizedImages" for non-PDF file types.<br/>For any option that is not "none", the images will be exposed in the *normalized_images* field. <br/>The default is "none." This configuration is only pertinent to blob data sources, when "dataToExtract" is set to "contentAndMetadata." <br/>A maximum of 1000 images will be extracted from a given document. If there are more than 1000 images in a document, the first 1000 will be extracted and a warning will be generated. |
|  normalizedImageMaxWidth | The maximum width (in pixels) for normalized images generated. The default is 2000. The maximum value allowed is 10000. | 
|  normalizedImageMaxHeight | The maximum height (in pixels) for normalized images generated. The default is 2000. The maximum value allowed is 10000.|

> [!NOTE]
> If you set the *imageAction* property to anything other than "none", you'll not be able to set the *parsingMode* property to anything other than "default".  You may only set one of these two properties to a non-default value in your indexer configuration.

Set the **parsingMode** parameter to `json` (to index each blob as a single document) or `jsonArray` (if your blobs contain JSON arrays and you need each element of an array to be treated as a separate document).

The default of 2000 pixels for the normalized images maximum width and height is based on the maximum sizes supported by the [OCR skill](cognitive-search-skill-ocr.md) and the [image analysis skill](cognitive-search-skill-image-analysis.md). The [OCR skill](cognitive-search-skill-ocr.md) supports a maximum width and height of 4200 for non-English languages, and 10000 for English.  If you increase the maximum limits, processing could fail on larger images depending on your skillset definition and the language of the documents. 

You specify the imageAction in your [indexer definition](https://docs.microsoft.com/rest/api/searchservice/create-indexer) as follows:

```json
{
  //...rest of your indexer definition goes here ...
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

When the *imageAction* is set to a value other then "none", the new *normalized_images* field will contain an array of images. Each  image is a complex type that has the following members:

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

## Image-related skills

There are two built-in cognitive skills that take images as an input: [OCR](cognitive-search-skill-ocr.md) and [Image Analysis](cognitive-search-skill-image-analysis.md). 

Currently, these skills only work with images generated from the document cracking step. As such, the only supported input is `"/document/normalized_images"`.

### Image Analysis skill

The [Image Analysis skill](cognitive-search-skill-image-analysis.md) extracts a rich set of visual features based on the image content. For instance, you can generate a caption from an image, generate tags, or identify celebrities and landmarks.

### OCR skill

The [OCR skill](cognitive-search-skill-ocr.md) extracts text from image files such as JPGs, PNGs, and bitmaps. It can extract text as well as layout information. The layout  information provides bounding boxes for each of the strings identified.

## Embedded image scenario

A common scenario involves creating a single string containing all file contents, both text and image-origin text, by performing the following steps:  

1. [Extract normalized_images](#get-normalized-images)
1. Run the OCR skill using `"/document/normalized_images"` as input
1. Merge the text representation of those images with the raw text extracted from the file. You can use the [Text Merge](cognitive-search-skill-textmerger.md) skill to consolidate both text chunks into a single large string.

The following example skillset creates a *merged_text* field containing the textual content of your document. It also includes the OCRed text from each of the embedded images. 

#### Request body syntax
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

## See also
+ [Create indexer (REST)](https://docs.microsoft.com/rest/api/searchservice/create-indexer)
+ [Image Analysis skill](cognitive-search-skill-image-analysis.md)
+ [OCR skill](cognitive-search-skill-ocr.md)
+ [Text merge skill](cognitive-search-skill-textmerger.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
+ [How to map enriched fields](cognitive-search-output-field-mapping.md)
