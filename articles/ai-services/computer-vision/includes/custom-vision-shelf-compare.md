---
title: "Custom Vision Shelf Analysis comparison table"
titleSuffix: "Azure AI services"
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: azure-ai-vision
ms.topic: include
ms.date: 12/04/2023
ms.author: pafarley
---

|Areas | Products on Shelves – Custom Vision |Product Recognition – Image Analysis API/Customization |
|---|---|---|
|Features | Custom product understanding |Image stitching & rectification,</br>Pretrained product understanding,</br>Custom product understanding,</br>Planogram matching |  
|Base model |CNN |Florence |
|Labeling |Customvision.ai |AML Studio or COCO file |
|Web Portal |Customvision.ai |Vision Studio |
|Libraries |REST, SDK |REST, Python Sample |
|Minimum training data needed |15 images per category |2-5 images per category| 
|Training data storage |Uploaded to service |In customer’s blob storage account |
|Model hosting |Cloud and Edge |Cloud hosting only, Edge container hosting to come |
|AIQ| <table ><colgroup><col ><col ></colgroup><thead><tr><th>context</th><th>Top-1 accuracy on 14 datasets</th></tr></thead><tbody><tr><td>1shot (catalog)</td><td>29.4</td></tr><tr><td>2shot</td><td>57.1</td></tr><tr><td>3shot</td><td>66.7</td></tr><tr><td>5shot</td><td>80.8</td></tr><tr><td>10shot</td><td>86.4</td></tr><tr><td>full</td><td>94.9</td></tr></tbody></table>| <table ><colgroup><col ><col ></colgroup><thead><tr><th>context</th><th>Top-1 accuracy on 14 datasets</th></tr></thead><tbody><tr><td>1shot (catalog)</td><td>86.9</td></tr><tr><td>2shot</td><td>88.8</td></tr><tr><td>3shot</td><td>89.8</td></tr><tr><td>5shot</td><td>90.3</td></tr><tr><td>10shot</td><td>91.0</td></tr><tr><td>full</td><td>95.4</td></tr></tbody></table>|

