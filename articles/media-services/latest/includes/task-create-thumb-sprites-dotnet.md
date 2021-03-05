---
author: IngridAtMicrosoft
ms.service: media-services 
ms.topic: include
ms.date: 2/17/2020
ms.author: inhenkel
ms.custom: REST
---

<!--Create a thumbnail sprites dotnet-->

```aspx-csharp

new TransformOutput(
                        new StandardEncoderPreset(
                            codecs: new Codec[]
                            {
                                // Generate a set of thumbnails in one Jpg file (thumbnail sprite)
                                new JpgImage(
                                    start: "0%",
                                    step: "5%",
                                    range: "100%",
                                    spriteColumn: 10,
                                    layers: new JpgLayer[]{
                                        new JpgLayer(
                                            width: "20%",
                                            height: "20%",
                                            quality : 90
                                        )
                                    }
                                )
                            },
                            // Specify the format for the output files - one for video+audio, and another for the thumbnail sprite
                            formats: new Format[]
                            {
                                new JpgFormat(
                                    filenamePattern:"ThumbnailSprite-{Basename}-{Index}{Extension}"
                                )
                            }
                        ),
                        onError: OnErrorType.StopProcessingJob,
                        relativePriority: Priority.Normal
                    )
                };
```
