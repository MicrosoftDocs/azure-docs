---
author: IngridAtMicrosoft
ms.service: media-services 
ms.topic: include
ms.date: 2/17/2020
ms.author: inhenkel
ms.custom: REST
---

<!--Create a thumbnail sprites REST-->

The following Azure REST command creates a thumbnail sprite transform. Replace the values `subscriptionID`, `resourceGroup`, and `accountName` with values you are currently working with. 

Give your transform a name by setting `transformName`.

```REST

PUT https://management.azure.com/subscriptions/{{subscriptionId}}/resourceGroups/{{resourceGroup}}/providers/Microsoft.Media/mediaServices/{{accountName}}/transforms/{{transformName}}?api-version={{api-version}}

```

## Body

```json
{
    "properties": {
    "description": "Basic Transform using the Standard Encoder, JpgImage, JpgLayer, and JpgFormat ",
    "outputs": [{
        "onError": "StopProcessingJob",
        "relativePriority": "Normal",
        "preset": {
            "@odata.type": "#Microsoft.Media.StandardEncoderPreset",
            "Codecs": [{
                "@odata.type": "#Microsoft.Media.JpgImage",
                "start": "1",
                "step": "5%",
                "range": "100%",
                "spriteColumn": 10,
                "layers": [{
                    "@odata.type" : "#Microsoft.Media.JpgLayer",
                    "width": "20%",
                    "height": "20%",
                    "quality" : 90
                }]
                }],
            "formats":[{
                "@odata.type" : "#Microsoft.Media.JpgFormat",
                "filenamePattern":"ThumbnailSprite-{Basename}-{Index}{Extension}"
                }]
            }
        }]
    }
}
```

## Sample response
```json
{
    "name": "thumbnailsprites",
    "id": "/subscriptions/<your subscription ID>/resourceGroups/<your resource group name/providers/Microsoft.Media/mediaservices/<your account name>/transforms/thumbnailsprites",
    "type": "Microsoft.Media/mediaservices/transforms",
    "properties": {
        "created": "2021-02-17T21:56:06.6213416Z",
        "description": "Basic Transform using the Standard Encoder, JpgImage, JpgLayer, and JpgFormat ",
        "lastModified": "2021-02-17T21:57:17.3241984Z",
        "outputs": [
            {
                "onError": "StopProcessingJob",
                "relativePriority": "Normal",
                "preset": {
                    "@odata.type": "#Microsoft.Media.StandardEncoderPreset",
                    "codecs": [
                        {
                            "@odata.type": "#Microsoft.Media.JpgImage",
                            "stretchMode": "AutoSize",
                            "syncMode": "Auto",
                            "start": "1",
                            "step": "5%",
                            "range": "100%",
                            "layers": [
                                {
                                    "width": "20%",
                                    "height": "20%",
                                    "quality": 90
                                }
                            ],
                            "spriteColumn": 10
                        }
                    ],
                    "formats": [
                        {
                            "@odata.type": "#Microsoft.Media.JpgFormat",
                            "filenamePattern": "ThumbnailSprite-{Basename}-{Index}{Extension}"
                        }
                    ]
                }
            }
        ]
    }
}
```
