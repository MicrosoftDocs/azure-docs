---
title: "Custom Vision Image Analysis comparison table"
titleSuffix: "Azure AI services"
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: azure-ai-vision
ms.topic: include
ms.date: 12/04/2023
ms.author: pafarley
---

| Areas | Custom Vision service | Image Analysis 4.0 service |
| --- | --- | --- |
|Tasks |Image classification</br>Object detection |Image classification</br>Object detection |
|Base model |CNN  |Transformer model |
|Labeling|[Customvision.ai](https://www.customvision.ai/) |AML Studio or COCO file |
|Web Portal |[Customvision.ai](https://www.customvision.ai/) |[Vision Studio](https://portal.vision.cognitive.azure.com/gallery/featured) |
|Libraries |REST, SDK |REST, Python Sample |
|Minimum training data needed |15 images per category |2-5 images per category |
|Training data storage |Uploaded to service |In customer’s blob storage account |
|Model hosting |Cloud and Edge |Cloud hosting only, Edge container hosting to come |
|AIQ  | <table style="undefined;table-layout: fixed; width: 285px"><colgroup><col style="width: 101px"><col style="width: 84px"><col style="width: 100px"></colgroup><thead><tr><th>context</th><th>IC (top-1 accuracy, 22 datasets)</th><th>OD (mAP@50, 59 datasets)</th></tr></thead><tbody><tr><td>0shot</td><td>N/A</td><td>N/A</td></tr><tr><td>2shot</td><td>51.47</td><td>33.3</td></tr><tr><td>3shot</td><td>56.73</td><td>37.0</td></tr><tr><td>5shot</td><td>63.01</td><td>43.4</td></tr><tr><td>10shot</td><td>68.95</td><td>54.0</td></tr><tr><td>full</td><td>85.25</td><td>76.6</td></tr></tbody></table> | <table style="undefined;table-layout: fixed; width: 285px"><colgroup><col style="width: 101px"><col style="width: 84px"><col style="width: 100px"></colgroup><thead><tr><th>context</th><th>IC (top-1 accuracy, 22 datasets)</th><th>OD (mAP@50, 59 datasets)</th></tr></thead><tbody><tr><td>0shot</td><td>57.8</td><td>27.1</td></tr><tr><td>2shot</td><td>73.02</td><td>49.2</td></tr><tr><td>3shot</td><td>75.51</td><td>61.1</td></tr><tr><td>5shot</td><td>79.14</td><td>68.2</td></tr><tr><td>10shot</td><td>81.31</td><td>75.0</td></tr><tr><td>full</td><td>90.98</td><td>85.4</td></tr></tbody></table> |