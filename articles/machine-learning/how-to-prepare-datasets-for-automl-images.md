---
title: Prepare datasets for AutoML Images
titleSuffix: Azure Machine Learning
description: Image data preparation for Azure Machine Learning automated ML to train computer vision models on classification, object detection,  and segmentation
author: vadthyavath
ms.author: rvadthyavath
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.custom: template-how-to
ms.date: 09/30/2021
---

# Preparing Datasets for AutoML Images

In this article, you'll learn how to prepare image datasets for computer vision models on AutoML. we'll describe the schema and data preparation needed for 
+ **Image Classification**
+ **Multi-label Image Classification**
+ **Object Detection**
+ **Instance Segmentation**

You'll also learn to upload prepared datasets to [datastore](https://docs.microsoft.com/en-us/azure/machine-learning/concept-azure-machine-learning-architecture#datasets-and-datastores) and understand inference formats for different tasks.

In order to generate models for computer vision, you'll need to bring in labeled image data as input for model training in the form of an AzureML Labeled Dataset. You can either use a Labeled Dataset that you've exported from a Data Labeling project, or create a new AzureML Labeled Dataset with your labeled training data.


## Input Data formats/Schema for AutoML vision models

Azure Machine Learning AutoML for Images requires input image data to be prepared in [JSONL](https://jsonlines.org/) (JSON Lines) format. This section describes input data formats/schema for multi-class, multi-label image classification, object detection, and instance segmentation. We'll also provide a sample of final training or validation JSON Lines file.

### Image Classification (binary/multi-class)

![Image Classification](./media/how-to-prepare-datasets-for-automl-images/testimage_multiclass_predictions_vis.jpg)

| Key       | Description  | Example |
| -------- |----------|-----|
| image_url | Image location in AML datastore<br>`Required, String` | `"AmlDatastore://data_directory/Image_01.jpg"` |
| format  | Image type (all the Image formats available in Pillow library are supported)<br>`Optional, String from { "jpg", "jpeg", "png", "jpe", "jfif","bmp", "tif", "tiff"}`  |  `"jpg" or "jpeg" or "png" or "jpe" or "jfif" or "bmp" or "tif" or "tiff"` |
| width | width of the image<br>`Optional, String or Positive Integer`  | `"400px" or 400`|
| height | height of the image<br>`Optional, String or Positive Integer` | `"200px" or 200` |
| label | class/label of the image<br>`Required, String` | `"cat"` |
| label_confidence | confidence score of class/label<br>`Optional, Float in [0,1]` | `1.0` |


**Input data format/schema in each JSON Line:**
```json
{
   "image_url":"AmlDatastore://data_directory/../Image_name.image_format",
   "image_details":{
      "format":"image_format",
      "width":"image_width",
      "height":"image_height"
   },
   "label":"class_name",
   "label_confidence":"confidence_score"
}
```

Example of a JSONL file for multi-class image classification:
```json
{"image_url": "AmlDatastore://image_data/Image_01.jpg", "image_details":{"format": "jpg", "width": "400px", "height": "258px"}, "label": "can","label_confidence": 1.0}
{"image_url": "AmlDatastore://image_data/Image_02.jpg", "image_details": {"format": "jpg", "width": "397px", "height": "296px"}, "label": "milk_bottle","label_confidence": 1.0}
.
.
.
{"image_url": "AmlDatastore://image_data/Image_n.jpg", "image_details": {"format": "jpg", "width": "1024px", "height": "768px"}, "label": "water_bottle","label_confidence": 1.0}
  ```

### Multi-label Image Classification

![Image Classification](./media/how-to-prepare-datasets-for-automl-images/testimage_multilabel_predictions_vis.jpg)

| Key       | Description  | Example |
| -------- |----------|-----|
| image_url | Image location in AML datastore<br>`Required, String` | `"AmlDatastore://data_directory/Image_01.jpg"` |
| format  | Image type (all the Image formats available in Pillow library are supported)<br>`Optional, String from { "jpg", "jpeg", "png", "jpe", "jfif", "bmp", "tif", "tiff" }`  |  `"jpg" or "jpeg" or "png" or "jpe" or "jfif" or "bmp" or "tif" or "tiff"` |
| width | width of the image<br>`Optional, String or Positive Integer`  | `"400px" or 400`|
| height | height of the image<br>`Optional, String or Positive Integer` | `"200px" or 200` |
| label | list of classes/labels in the image<br>`Required, List of Strings` | `["cat","dog"]` |
| label_confidence | confidence score of class/label<br>`Optional, Float in [0,1]` | `1.0` |

**Input data format/schema in each JSON Line:**
```json
{
   "image_url":"AmlDatastore://data_directory/../Image_name.image_format",
   "image_details":{
      "format":"image_format",
      "width":"image_width",
      "height":"image_height"
   },
   "label":[
      "class_1",
      "class_2",
      "class_3",
      ...
   ],
   "label_confidence":[
      conf_score_class_1,
      conf_score_class_2,
      ...
   ]
}
```

Example of a JSONL file for multi-label image classification:

```json
{"image_url": "AmlDatastore://image_data/Image_01.jpg", "image_details":{"format": "jpg", "width": "400px", "height": "258px"}, "label": ["can"]}
{"image_url": "AmlDatastore://image_data/Image_02.jpg", "image_details": {"format": "jpg", "width": "397px", "height": "296px"}, "label": ["can","milk_bottle"]}
.
.
.
{"image_url": "AmlDatastore://image_data/Image_n.jpg", "image_details": {"format": "jpg", "width": "1024px", "height": "768px"}, "label": ["carton","milk_bottle","water_bottle"]}
  ```

### Object Detection

![Image Classification](./media/how-to-prepare-datasets-for-automl-images/testimage_objectdetection_predictions_vis.jpg)

| Key       | Description  | Example |
| -------- |----------|-----|
| image_url | Image location in Aml datastore<br>`Required, String` | `"AmlDatastore://data_directory/Image_01.jpg"` |
| format  | Image type (all the Image formats available in Pillow library are supported. But for YOLO only image formats allowed by opencv are supported)<br>`Optional, String from { "jpg", "jpeg", "png", "jpe", "jfif", "bmp", "tif", "tiff" }`  |  `"jpg" or "jpeg" or "png" or "jpe" or "jfif" or "bmp" or "tif" or "tiff"` |
| width | width of the image<br>`Optional, String or Positive Integer`  | `"499px" or 499`|
| height | height of the image<br>`Optional, String or Positive Integer` | `"665px" or 665` |
| label (outer key) | list of bounding boxes, where each box is a dictionary of `label, topX, topY, bottomX, bottomY, isCrowd, isTruncated` their top-left and bottom-right coordinates<br>`Required, List of dictionaries` | `[{"label": "cat", "topX": 0.2605210420841683, "topY": 0.4069069069069069, "bottomX": 0.7354709418837675, "bottomY": 0.7012012012012012, "isCrowd": 0, "isTruncated": "false"}]` |
| label (inner key)| class/label of the object in the bounding box<br>`Required, String` | `"cat"` |
| topX | ratio of x coordinate of top-left corner of the bounding box and width of the image<br>`Required, Double in [0,1]` | `0.2605210420841683` |
| topY | ratio of y coordinate of top-left corner of the bounding box and height of the image<br>`Required, Double in [0,1]` | `0.4069069069069069` |
| bottomX | ratio of x coordinate of bottom-right corner of the bounding box and width of the image<br>`Required, Double in [0,1]` | `0.7354709418837675` |
| bottomY | ratio of y coordinate of bottom-right corner of the bounding box and height of the image<br>`Required, Double in [0,1]` | `0.7012012012012012` |
| isCrowd | indicates whether the bbox is around the crowd of objects<br>`Optional, Bool` | `0` |
| isTruncated | indicates whether the object extends beyond the boundary of the image<br>`Optional, Bool` | `false` |

**Input data format/schema in each JSON Line:**

Here, 
- xmin = x_coordinate_of_top-left_corner_of_bbox
- ymin = y_coordinate_of_top-left_corner_of_bbox
- xmax = x_coordinate_of_bottom-right_corner_of_bbox
- ymax = y_coordinate_of_bottom-right_corner_of_bbox

```json
{
   "image_url":"AmlDatastore://data_directory/../Image_name.image_format",
   "image_details":{
      "format":"image_format",
      "width":"image_width",
      "height":"image_height"
   },
   "label":[
      {
         "label":"class_name_1",
         "topX":xmin/width,
         "topY":ymin/height,
         "bottomX":xmax/width,
         "bottomY":ymax/height,
         "isCrowd":isCrowd,
         "isTruncated":isTruncated
      },
      {
         "label":"class_name_2",
         "topX":xmin/width,
         "topY":ymin/height,
         "bottomX":xmax/width,
         "bottomY":ymax/height,
         "isCrowd":isCrowd,
         "isTruncated":isTruncated
      },
      ...
   ]
}
```

Example of a JSONL file for Object Detection:
```json
{"image_url": "AmlDatastore://image_data/Image_01.jpg", "image_details": {"format": "jpg", "width": "499px", "height": "666px"}, "label": [{"label": "can", "topX": 0.2605210420841683, "topY": 0.4069069069069069, "bottomX": 0.7354709418837675, "bottomY": 0.7012012012012012, "isCrowd": 0, "isTruncated": "false"}]}
{"image_url": "AmlDatastore://image_data/Image_02.jpg", "image_details": {"format": "jpg", "width": "499px", "height": "666px"}, "label": [{"label": "carton", "topX": 0.17234468937875752, "topY": 0.15315315315315314, "bottomX": 0.43286573146292584, "bottomY": 0.6591591591591591, "isCrowd": 0, "isTruncated": "false"}, {"label": "milk_bottle", "topX": 0.30060120240480964, "topY": 0.566066066066066, "bottomX": 0.8917835671342685, "bottomY": 0.7357357357357357, "isCrowd": 0, "isTruncated": "false"}]}
.
.
.
{"image_url": "AmlDatastore://image_data/Image_n.jpg", "image_details": {"format": "jpg", "width": "499px", "height": "666px"}, "label": [{"label": "carton", "topX": 0.018036072144288578, "topY": 0.2972972972972973, "bottomX": 0.3807615230460922, "bottomY": 0.8363363363363363, "isCrowd": 0, "isTruncated": "false"}, {"label": "milk_bottle", "topX": 0.45490981963927857, "topY": 0.3483483483483483, "bottomX": 0.6132264529058116, "bottomY": 0.6831831831831832, "isCrowd": 0, "isTruncated": "false"}, {"label": "water_bottle", "topX": 0.6673346693386774, "topY": 0.27927927927927926, "bottomX": 0.8416833667334669, "bottomY": 0.6156156156156156, "isCrowd": 0, "isTruncated": "false"}]}
  ```


### Instance Segmentation

![Image Classification](./media/how-to-prepare-datasets-for-automl-images/testimage_instance_segmentation_predictions_vis.jpg)

| Key       | Description  | Example |
| -------- |----------|-----|
| image_url | Image location in Aml datastore<br>`Required, String` | `"AmlDatastore://data_directory/Image_01.jpg"` |
| format  | Image type<br>`Optional, String from { "jpg", "jpeg", "png", "jpe", "jfif", "bmp", "tif", "tiff" }`  |  `"jpg" or "jpeg" or "png" or "jpe" or "jfif" or "bmp" or "tif" or "tiff"` |
| width | width of the image<br>`Optional, String or Positive Integer`  | `"499px" or 499`|
| height | height of the image<br>`Optional, String or Positive Integer` | `"665px" or 665` |
| label (outer key) | list of masks, where each mask is a dictionary of `label, bbox, isCrowd, polygon coordinates` <br>`Required, List of dictionaries` | ` [{"label": "can", "bbox": "null", "isCrowd": 0, "polygon": [[0.5771543086172345, 0.6891891891891891,`<br> ` 0.5671342685370742, 0.6891891891891891,`<br> `0.5591182364729459, 0.6861861861861862]]}]` |
| label (inner key)| class/label of the object in the mask<br>`Required, String` | `"cat"` |
| isCrowd | indicates whether the mask is around the crowd of objects<br>`Optional, Bool` | `0` |
| polygon | polygon coordinates for the mask<br>`Required, List of List of Double values in [0,1]` | ` [[0.5771543086172345, 0.6891891891891891, 0.5671342685370742, 0.6891891891891891, 0.5591182364729459, 0.6861861861861862]]` |

**Input data format/schema in each JSON Line:**
```json
{
   "image_url":"AmlDatastore://data_directory/../Image_name.image_format",
   "image_details":{
      "format":"image_format",
      "width":"image_width",
      "height":"image_height"
   },
   "label":[
      {
         "label":"class_name",
         "isCrowd":isCrowd,
         "polygon":[[x1 y1 x2 y2 x3 y3 ...xn yn]]
      }
   ]
}
```

Example of a JSONL file for Instance Segmentation:

```python
{"image_url": "AmlDatastore://image_data/Image_01.jpg", "image_details": {"format": "jpg", "width": "499px", "height": "666px"}, "label": [{"label": "can", "bbox": "null", "isCrowd": 0, "polygon": [[0.5771543086172345, 0.6891891891891891, 0.5671342685370742, 0.6891891891891891, 0.5591182364729459, 0.6861861861861862, 0.3807615230460922, 0.5930930930930931, 0.3046092184368738, 0.5555555555555556, 0.29458917835671344, 0.545045045045045, 0.2905811623246493, 0.5345345345345346, 0.2745490981963928, 0.512012012012012, 0.27054108216432865, 0.496996996996997, 0.27054108216432865, 0.47897897897897895, 0.2845691382765531, 0.45345345345345345, 0.30861723446893785, 0.43243243243243246, 0.32665330661322645, 0.42342342342342343, 0.35671342685370744, 0.4159159159159159, 0.4188376753507014, 0.4174174174174174, 0.6352705410821643, 0.493993993993994, 0.6833667334669339, 0.5075075075075075, 0.7014028056112225, 0.5180180180180181, 0.7094188376753507, 0.5285285285285285, 0.7134268537074149, 0.545045045045045, 0.7194388777555111, 0.5540540540540541, 0.7194388777555111, 0.5795795795795796, 0.7134268537074149, 0.5975975975975976, 0.6973947895791583, 0.6216216216216216, 0.6953907815631263, 0.6291291291291291, 0.6312625250501002, 0.6786786786786787, 0.6192384769539078, 0.6831831831831832, 0.5951903807615231, 0.6831831831831832, 0.5771543086172345, 0.6891891891891891]]}]}
{"image_url": "AmlDatastore://image_data/Image_02.jpg", "image_details": {"format": "jpg", "width": "499px", "height": "666px"}, "label": [{"label": "carton", "bbox": "null", "isCrowd": 0, "polygon": [[0.24048096192384769, 0.6576576576576577, 0.23446893787575152, 0.6546546546546547, 0.23046092184368738, 0.6471471471471472, 0.21042084168336672, 0.512012012012012, 0.20240480961923848, 0.4039039039039039, 0.18236472945891782, 0.2672672672672673, 0.1843687374749499, 0.24174174174174173, 0.18036072144288579, 0.16666666666666666, 0.18637274549098196, 0.15915915915915915, 0.19839679358717435, 0.15615615615615616, 0.3967935871743487, 0.16216216216216217, 0.4088176352705411, 0.16966966966966968, 0.40681362725450904, 0.21771771771771772, 0.4148296593186373, 0.24924924924924924, 0.4228456913827655, 0.2627627627627628, 0.4228456913827655, 0.5690690690690691, 0.342685370741483, 0.5690690690690691, 0.3346693386773547, 0.5720720720720721, 0.32064128256513025, 0.5855855855855856, 0.30861723446893785, 0.6246246246246246, 0.3066132264529058, 0.6486486486486487, 0.24048096192384769, 0.6576576576576577]]}, {"label": "milk_bottle", "bbox": "null", "isCrowd": 0, "polygon": [[0.6753507014028056, 0.7327327327327328, 0.6352705410821643, 0.7312312312312312, 0.6212424849699398, 0.7252252252252253, 0.5731462925851704, 0.7177177177177178, 0.5190380761523046, 0.7177177177177178, 0.5050100200400801, 0.7207207207207207, 0.46292585170340683, 0.7222222222222222, 0.43887775551102204, 0.7192192192192193, 0.3967935871743487, 0.7192192192192193, 0.3587174348697395, 0.7147147147147147, 0.3346693386773547, 0.7147147147147147, 0.3226452905811623, 0.7117117117117117, 0.312625250501002, 0.7012012012012012, 0.3066132264529058, 0.6876876876876877, 0.3046092184368738, 0.6636636636636637, 0.30861723446893785, 0.6306306306306306, 0.32064128256513025, 0.5960960960960962, 0.32064128256513025, 0.5885885885885885, 0.32665330661322645, 0.5795795795795796, 0.34468937875751504, 0.5690690690690691, 0.3787575150300601, 0.5690690690690691, 0.4969939879759519, 0.575075075075075, 0.5150300601202404, 0.5780780780780781, 0.531062124248497, 0.5840840840840841, 0.561122244488978, 0.5870870870870871, 0.6132264529058116, 0.5870870870870871, 0.6372745490981964, 0.5825825825825826, 0.6653306613226453, 0.5825825825825826, 0.7034068136272545, 0.5900900900900901, 0.7474949899799599, 0.6126126126126126, 0.7595190380761523, 0.6156156156156156, 0.781563126252505, 0.6156156156156156, 0.7995991983967936, 0.6081081081081081, 0.8096192384769539, 0.6066066066066066, 0.8156312625250501, 0.6081081081081081, 0.8296593186372746, 0.6186186186186187, 0.8637274549098196, 0.6201201201201201, 0.875751503006012, 0.6246246246246246, 0.8817635270541082, 0.6321321321321322, 0.8857715430861723, 0.6456456456456456, 0.8877755511022044, 0.6741741741741741, 0.8837675350701403, 0.6936936936936937, 0.8697394789579158, 0.7117117117117117, 0.8316633266533067, 0.7102102102102102, 0.8256513026052105, 0.7132132132132132, 0.8236472945891784, 0.7177177177177178, 0.8156312625250501, 0.7207207207207207, 0.8056112224448898, 0.7207207207207207, 0.7775551102204409, 0.7087087087087087, 0.7535070140280561, 0.7087087087087087, 0.7294589178356713, 0.7162162162162162, 0.7114228456913828, 0.7252252252252253, 0.6753507014028056, 0.7327327327327328]]}]}
.
.
.
{"image_url": "AmlDatastore://image_data/Image_n.jpg", "image_details": {"format": "jpg", "width": "499px", "height": "666px"}, "label": [{"label": "water_bottle", "bbox": "null", "isCrowd": 0, "polygon": [[0.3346693386773547, 0.6216216216216216, 0.3046092184368738, 0.6216216216216216, 0.2545090180360721, 0.6036036036036037, 0.16432865731462926, 0.6051051051051051, 0.15831663326653306, 0.6021021021021021, 0.1462925851703407, 0.6021021021021021, 0.14228456913827656, 0.6081081081081081, 0.09418837675350701, 0.6126126126126126, 0.0841683366733467, 0.5990990990990991, 0.08016032064128256, 0.5855855855855856, 0.08016032064128256, 0.539039039039039, 0.08216432865731463, 0.536036036036036, 0.09218436873747494, 0.5330330330330331, 0.12625250501002003, 0.53003003003003, 0.13226452905811623, 0.5330330330330331, 0.14428857715430862, 0.5330330330330331, 0.1623246492985972, 0.5255255255255256, 0.17234468937875752, 0.5255255255255256, 0.18637274549098196, 0.521021021021021, 0.1963927855711423, 0.521021021021021, 0.23046092184368738, 0.5135135135135135, 0.24248496993987975, 0.509009009009009, 0.2625250501002004, 0.4924924924924925, 0.2665330661322645, 0.4924924924924925, 0.28256513026052105, 0.481981981981982, 0.32064128256513025, 0.4744744744744745, 0.44889779559118237, 0.46546546546546547, 0.5811623246492986, 0.4519519519519519, 0.5991983967935872, 0.4519519519519519, 0.625250501002004, 0.45645645645645644, 0.6372745490981964, 0.46096096096096095, 0.6452905811623246, 0.46096096096096095, 0.657314629258517, 0.46546546546546547, 0.6673346693386774, 0.47897897897897895, 0.6673346693386774, 0.487987987987988, 0.6593186372745491, 0.4924924924924925, 0.6593186372745491, 0.4954954954954955, 0.6733466933867736, 0.5015015015015015, 0.6813627254509018, 0.5105105105105106, 0.6813627254509018, 0.5225225225225225, 0.6673346693386774, 0.5330330330330331, 0.6693386773547094, 0.5375375375375375, 0.6753507014028056, 0.5375375375375375, 0.6793587174348698, 0.5435435435435435, 0.6793587174348698, 0.551051051051051, 0.6673346693386774, 0.566066066066066, 0.6492985971943888, 0.5735735735735735, 0.6372745490981964, 0.575075075075075, 0.6152304609218436, 0.5840840840840841, 0.6072144288577155, 0.5840840840840841, 0.5951903807615231, 0.5885885885885885, 0.5691382765531062, 0.5855855855855856, 0.49899799599198397, 0.5855855855855856, 0.46693386773547096, 0.5870870870870871, 0.4468937875751503, 0.5915915915915916, 0.38877755511022044, 0.5930930930930931, 0.3627254509018036, 0.5960960960960962, 0.3527054108216433, 0.6066066066066066, 0.3527054108216433, 0.6171171171171171, 0.3346693386773547, 0.6216216216216216]]}, {"label": "milk_bottle", "bbox": "null", "isCrowd": 0, "polygon": [[0.3927855711422846, 0.7732732732732732, 0.3807615230460922, 0.7732732732732732, 0.3727454909819639, 0.7672672672672672, 0.3667334669338677, 0.7552552552552553, 0.3627254509018036, 0.7357357357357357, 0.3627254509018036, 0.7147147147147147, 0.3527054108216433, 0.6441441441441441, 0.3527054108216433, 0.6111111111111112, 0.3627254509018036, 0.5975975975975976, 0.40480961923847697, 0.5930930930930931, 0.44488977955911824, 0.5930930930930931, 0.46693386773547096, 0.5885885885885885, 0.49498997995991983, 0.5885885885885885, 0.5150300601202404, 0.5855855855855856, 0.6292585170340681, 0.5885885885885885, 0.6713426853707415, 0.5825825825825826, 0.7134268537074149, 0.5720720720720721, 0.7595190380761523, 0.5720720720720721, 0.8016032064128257, 0.5825825825825826, 0.8216432865731463, 0.5930930930930931, 0.8476953907815631, 0.5930930930930931, 0.8657314629258517, 0.5825825825825826, 0.875751503006012, 0.5795795795795796, 0.8877755511022044, 0.5795795795795796, 0.905811623246493, 0.5885885885885885, 0.9438877755511023, 0.5885885885885885, 0.9659318637274549, 0.6006006006006006, 0.9779559118236473, 0.6156156156156156, 0.9859719438877755, 0.6366366366366366, 0.9859719438877755, 0.6591591591591591, 0.9799599198396793, 0.6726726726726727, 0.9619238476953907, 0.6831831831831832, 0.9318637274549099, 0.6891891891891891, 0.9318637274549099, 0.6921921921921922, 0.9178356713426854, 0.7012012012012012, 0.8977955911823647, 0.7027027027027027, 0.8837675350701403, 0.6966966966966966, 0.8597194388777555, 0.6951951951951952, 0.8476953907815631, 0.6996996996996997, 0.8396793587174348, 0.7072072072072072, 0.8036072144288577, 0.7282282282282282, 0.7855711422845691, 0.7312312312312312, 0.7835671342685371, 0.7342342342342343, 0.7715430861723447, 0.7372372372372372, 0.6492985971943888, 0.7372372372372372, 0.6132264529058116, 0.7432432432432432, 0.5551102204408818, 0.7582582582582582, 0.49899799599198397, 0.7612612612612613, 0.4749498997995992, 0.7657657657657657, 0.4348697394789579, 0.7672672672672672, 0.3927855711422846, 0.7732732732732732]]}]}
```

## Input Data Preparation

There are three ways in which you can prepare the data to train computer vision models on AutoML for images.
+ **Azure Machine Learning data labeling** (if labeled data is unavailable then use data labeling tool to manually label images, which automatically generates the data required for training in the expected format)
+ **Use converters** (use the script provided to generate JSONL files for images)
+ **Custom script** (Use your own script to generate the data in JSON Lines format based on the schema defined below.)

### Azure Machine Learning data labeling

For manually labeling image datasets, refer to [Azure Machine Learning data labeling](https://docs.microsoft.com/en-us/azure/machine-learning/how-to-create-image-labeling-projects#create-a-labeling-project) tool for machine-learning-assisted data labeling, or human-in-the-loop labeling. It helps to create, manage, and monitor data labeling tasks for 
+ Image classification (multi-class and multi-label)
+ Object detection (bounding box)
+ Instance segmentation (polygon)

### Use Converters

For popular vision data formats, we provide scripts to generate JSONL files for training and validation data. For example, VOC and COCO data formats for Object detection are frequently used in computer vision. We provide scripts to convert data from raw files to JSON Lines text files for training and validation sets.

#### Image Classification (binary/multi-class)
If the images are stored in their respective class wise directories like the following,
- /water_bottle/
- /milk_bottle/
- /carton/
- /can/

where {water_bottle, milk_bottle, carton, can} are the classes in the dataset. We need to convert this data to JSONL format and upload all the images along with JSONL files for training and validation sets to create AzureML Dataset, which can be used for training models.
We'll use [fridgeObjects](https://cvbp-secondary.z19.web.core.windows.net/datasets/image_classification/fridgeObjects.zip) dataset with 134 images and 4 classes/labels to explain the JSONL file generation process. Following script generates `train_annotations.jsonl` and `validation_annotations.jsonl` files under the parent directory with 80% of the data for training and 20% for validation. For more information on multi-class classification schema for JSONL files, see input data format/schema section.

```python
import json
import os

src = "./fridgeObjects/"
train_validation_ratio = 5

# Retrieving default datastore that got automatically created when we setup a workspace
workspaceblobstore = ws.get_default_datastore().name

# Path to the training and validation files
train_annotations_file = os.path.join(src, "train_annotations.jsonl")
validation_annotations_file = os.path.join(src, "validation_annotations.jsonl")

# sample json line dictionary
json_line_sample = \
    {
        "image_url": "AmlDatastore://" + workspaceblobstore + "/"
                     + os.path.basename(os.path.dirname(src)),
        "label": "",
        "label_confidence": 1.0
    }

index = 0
# Scan each sub directary and generate jsonl line
with open(train_annotations_file, 'w') as train_f:
    with open(validation_annotations_file, 'w') as validation_f:
        for className in os.listdir(src):
            subDir = src + className
            if not os.path.isdir(subDir):
                continue
            # Scan each sub directary
            print("Parsing " + subDir)
            for image in os.listdir(subDir):
                json_line = dict(json_line_sample)
                json_line["image_url"] += f"/{className}/{image}"
                json_line["label"] = className

                if index % train_validation_ratio == 0:
                    # validation annotation
                    validation_f.write(json.dumps(json_line) + "\n")
                else:
                    # train annotation
                    train_f.write(json.dumps(json_line) + "\n")
                index += 1

```
For more information, see [AutoMLImage_MultiClass_SampleNotebook notebook](https://github.com/swatig007/automlForImages/tree/main/MultiClass).

#### Multi-label Image Classification
We'll use [multi-label fridge objects dataset](https://cvbp-secondary.z19.web.core.windows.net/datasets/image_classification/multilabelFridgeObjects.zip) of 128 images and 4 classes/labels {can, carton, milk bottle, water bottle} with a .csv file having image names with their respective labels and a folder containing all the images. It's one of the common data formats used in multi-label image classification.

Following script generates JSONL files (`train_annotations.jsonl` and `validation_annotations.jsonl`) for this dataset under the parent directory (multilabelFridgeObjects) with 80% of the dataset for training and 20% for validation. For more information on multi-label classification schema for JSONL files, see input data format/schema section.

```python
import json
import os
import xml.etree.ElementTree as ET

src = "./multilabelFridgeObjects"
train_validation_ratio = 5

# Retrieving default datastore that got automatically created when we setup a workspace
workspaceblobstore = ws.get_default_datastore().name

# Path to the labels file.
labelFile = os.path.join(src, "labels.csv")

# Path to the training and validation files
train_annotations_file = os.path.join(src, "train_annotations.jsonl")
validation_annotations_file = os.path.join(src, "validation_annotations.jsonl")

# sample json line dictionary
json_line_sample = \
    {
        "image_url": "AmlDatastore://" + workspaceblobstore + "/multilabelFridgeObjects",
        "label": []
    }

# Read each annotation and convert it to jsonl line
with open(train_annotations_file, 'w') as train_f:
    with open(validation_annotations_file, 'w') as validation_f:
        with open(labelFile, 'r') as labels:
            for i, line in enumerate(labels):
                # Skipping the title line and any empty lines.
                if (i == 0 or len(line.strip()) == 0):
                    continue
                line_split = line.strip().split(",")
                if len(line_split) != 2:
                    print("Skipping the invalid line: {}".format(line))
                    continue
                json_line = dict(json_line_sample)
                json_line["image_url"] += f"/images/{line_split[0]}"
                json_line["label"] = line_split[1].strip().split(" ")

                if i % train_validation_ratio == 0:
                    # validation annotation
                    validation_f.write(json.dumps(json_line) + "\n")
                else:
                    # train annotation
                    train_f.write(json.dumps(json_line) + "\n")


```
For more information, see [AutoMLImage_MultiLabel_SampleNotebook](https://github.com/swatig007/automlForImages/tree/main/MultiLabel).

#### Object Detection
Most Object Detection datasets are available in either Pascal VOC format or COCO format. In this section, you'll use raw input data available in Pascal VOC or COCO format and generate JSONL files.

#### Pascal VOC format:

we'll use [fridge object detection dataset](https://cvbp-secondary.z19.web.core.windows.net/datasets/object_detection/odFridgeObjects.zip) of 128 images and 4 classes or labels {can, carton, milk bottle, water bottle} to demonstrate object detection dataset preparation.

If your dataset is in Pascal VOC format, following script can be utilized to generate JSONL files. For more information on object detection schema for JSONL files, see input data format/schema section.

```python
import json
import os
import xml.etree.ElementTree as ET

src = "./odFridgeObjects/"
train_validation_ratio = 5

# Retrieving default datastore that got automatically created when we setup a workspace
workspaceblobstore = ws.get_default_datastore().name

# Path to the annotations
annotations_folder = os.path.join(src, "annotations")

# Path to the training and validation files
train_annotations_file = os.path.join(src, "train_annotations.jsonl")
validation_annotations_file = os.path.join(src, "validation_annotations.jsonl")

# sample json line dictionary
json_line_sample = \
    {
        "image_url": "AmlDatastore://" + workspaceblobstore + "/"
                     + os.path.basename(os.path.dirname(src)) + "/" + "images",
        "image_details": {"format": None, "width": None, "height": None},
        "label": []
    }

# Read each annotation and convert it to jsonl line
with open(train_annotations_file, 'w') as train_f:
    with open(validation_annotations_file, 'w') as validation_f:
        for i, filename in enumerate(os.listdir(annotations_folder)):
            if filename.endswith(".xml"):
                print("Parsing " + os.path.join(src, filename))

                root = ET.parse(os.path.join(annotations_folder, filename)).getroot()

                width = int(root.find('size/width').text)
                height = int(root.find('size/height').text)

                labels = []
                for object in root.findall('object'):
                    name = object.find('name').text
                    xmin = object.find('bndbox/xmin').text
                    ymin = object.find('bndbox/ymin').text
                    xmax = object.find('bndbox/xmax').text
                    ymax = object.find('bndbox/ymax').text
                    isCrowd = int(object.find('difficult').text)
                    labels.append({"label": name,
                                   "topX": float(xmin)/width,
                                   "topY": float(ymin)/height,
                                   "bottomX": float(xmax)/width,
                                   "bottomY": float(ymax)/height,
                                   "isCrowd": isCrowd})
                # build the jsonl file
                image_filename = root.find("filename").text
                _, file_extension = os.path.splitext(image_filename)
                json_line = dict(json_line_sample)
                json_line["image_url"] = json_line["image_url"] + "/" + image_filename
                json_line["image_details"]["format"] = file_extension[1:]
                json_line["image_details"]["width"] = width
                json_line["image_details"]["height"] = height
                json_line["label"] = labels

                if i % train_validation_ratio == 0:
                    # validation annotation
                    validation_f.write(json.dumps(json_line) + "\n")
                else:
                    # train annotation
                    train_f.write(json.dumps(json_line) + "\n")
            else:
                print("Skipping unknown file: {}".format(filename))

```
#### COCO format:
If your dataset is in COCO format, use the [coco2jsonl.py](https://github.com/swatig007/automlForImages/tree/main/ObjectDetection) script to generate JSONL files.
```python
# Generate jsonl file from coco file
!python coco2jsonl.py \
--input_coco_file_path "./odFridgeObjects_coco.json" \
--output_dir "./odFridgeObjects" --output_file_name "odFridgeObjects_from_coco.jsonl" \
--task_type "ObjectDetection" \
--base_url "AmlDatastore://workspaceblobstore/odFridgeObjects/images/"
```
For more information, see [AutoMLImage_ObjectDetection_SampleNotebook](https://github.com/swatig007/automlForImages/tree/main/ObjectDetection).

#### Instance Segmentation
Instance Segmentation datasets in Pascal VOC format consist of Images, their annotations (in XML format) and masks for each image. We'll use [fridge objects dataset](https://cvbp-secondary.z19.web.core.windows.net/datasets/object_detection/odFridgeObjectsMask.zip)in the VOC format to generate JSONL files using  [jsonl_converter](https://github.com/swatig007/automlForImages/tree/main/InstanceSegmentation) script.  

```python
from jsonl_converter import convert_mask_in_VOC_to_jsonl

data_path = "./odFridgeObjectsMask/"
convert_mask_in_VOC_to_jsonl(data_path, ws)
```
For more information, see [AutoMLImage_InstanceSegmentation_SampleNotebook](https://github.com/swatig007/automlForImages/tree/main/InstanceSegmentation).

### Custom script
If your dataset doesn't follow any of the previously mentioned raw formats, you can use your own script to generate JSON Lines files based on schema defined in the first section.

## Upload the JSONL file and images to Datastore
In order to use the data for training in Azure ML, we upload the data to our Azure ML Workspace via a [Datastore](https://docs.microsoft.com/en-us/azure/machine-learning/concept-azure-machine-learning-architecture#datasets-and-datastores). The datastore provides a mechanism for you to upload/download data, and interact with it from your remote compute targets. It's an abstraction over Azure Storage.

Upload the entire parent directory consisting of images and JSONL files to the cloud using the following code.
```python
# Retrieving default datastore that got automatically created when we setup a workspace
ds = ws.get_default_datastore()
ds.upload(src_dir='./fridgeObjects', target_path='fridgeObjects')
```
Once the data uploading is done, we can create an AzureML [Dataset](https://docs.microsoft.com/en-us/azure/machine-learning/concept-azure-machine-learning-architecture#datasets-and-datastores) for training and validation sets as below. If the validation JSONL file isn't provided, 20% of training data will be used for validation.

```python
from azureml.contrib.dataset.labeled_dataset import _LabeledDatasetFactory, LabeledDatasetTask
from azureml.core import Dataset

training_dataset_name = 'fridgeObjectsTrainingDataset'
if training_dataset_name in ws.datasets:
    training_dataset = ws.datasets.get(training_dataset_name)
    print('Found the training dataset', training_dataset_name)
else:
    # create training dataset
    training_dataset = _LabeledDatasetFactory.from_json_lines(
        task=LabeledDatasetTask.IMAGE_CLASSIFICATION, path=ds.path('fridgeObjects/train_annotations.jsonl'))
    training_dataset = training_dataset.register(workspace=ws, name=training_dataset_name)
    
# create validation dataset
validation_dataset_name = "fridgeObjectsValidationDataset"
if validation_dataset_name in ws.datasets:
    validation_dataset = ws.datasets.get(validation_dataset_name)
    print('Found the validation dataset', validation_dataset_name)
else:
    validation_dataset = _LabeledDatasetFactory.from_json_lines(
        task=LabeledDatasetTask.IMAGE_CLASSIFICATION, path=ds.path('fridgeObjects/validation_annotations.jsonl'))
    validation_dataset = validation_dataset.register(workspace=ws, name=validation_dataset_name)
    
    
print("Training dataset name: " + training_dataset.name)
print("Validation dataset name: " + validation_dataset.name)
```

## Data format for Inference
In this section, you'll learn the input data format required to make predictions with the endpoint. Use the deployed web service (model endpoint) to make inferences on new images. Any aforementioned image format is accepted with content type **application/octet-stream**

### Input format
Following is the input format needed to generate predictions on any task using task-specific model endpoint.

```python
import requests
from azureml.core.webservice import AksWebservice
from azureml.core.workspace import Workspace

aks_service_name = 'model-endpoint'
ws = Workspace.get(name=workspace_name,
                   subscription_id=subscription_id,
                   resource_group=resource_group)
aks_service = AksWebservice(ws, aks_service_name)
# URL for the web service
scoring_uri = aks_service.scoring_uri
# If the service is authenticated, set the key or token
key, _ = aks_service.get_keys()
# input image for inference
sample_image = './test_image.jpg'
# Load image data
data = open(sample_image, 'rb').read()
# Set the content type
headers = {'Content-Type': 'application/octet-stream'}
# If authentication is enabled, set the authorization header
headers['Authorization'] = f'Bearer {key}'
# Make the request and display the response
response = requests.post(scoring_uri, data, headers=headers)
```
### Output format

Predictions made on model endpoints follow different structure depending on the task type. This section explores the output data formats for multi-class, multi-label image classification, object detection, and instance segmentation tasks.  

#### Image Classification
Endpoint for Image classification returns all the labels in the dataset and their probability scores for the input image in the following format.
```json
{
   "filename":"/tmp/tmppjr4et28",
   "probs":[
      2.0982135993108386e-06,
      4.7837644956416625e-08,
      0.9999891519546509,
      8.63725108501967e-06
   ],
   "labels":[
      "can",
      "carton",
      "milk_bottle",
      "water_bottle"
   ]
}
```
#### Multi-label Image Classification
: TODO
#### Object Detection
: TODO
#### Instance Segmentation
: TODO