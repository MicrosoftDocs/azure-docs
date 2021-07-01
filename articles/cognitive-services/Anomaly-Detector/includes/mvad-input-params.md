---
title: MVAD input parameters
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: quying
manager: tonyxin
ms.service: cognitive-services
ms.topic: include
ms.date: 7/1/2021
ms.author: yingqunpku
---

### Input parameters

#### Required parameters

There are three required parameters in the request:

* `source` - This is the link to your zip file located in the Azure Blob Storage with Shared Access Signatures (SAS).
* `startTime` - The start time of data used to train an MVAD model. If it's earlier than the actual earliest timestamp in the data, the actual earliest timestamp will be used as the starting point.
* `endTime` - The end time of data used to train an MVAD model which must be later than or equal to `startTime`. If `endTime` is later than the actual latest timestamp in the data, the actual latest timestamp will be used as the end point.

#### Optional parameters

Other parameters are optional:

* `slidingWindow` - How many data points are used to determine anomalies. An integer between 28 and 2,880. The default value is 300. If `slidingWindow` is `k` for model training, then at least `k` points should be accessible from the data path during inference to get valid results.

    MVAD takes a segment of data points to decide if the next data point is an anomaly. The length of the segment is `slidingWindow`.
    Keep two things in mind when choosing a proper value for `slidingWindow`:
    1. The properties of your data: whether it's periodic and the sampling rate. When your data is periodic, you could set the length of 1 - 3 cycles as the `slidingWindow`. When your data is at a high frequency (small granularity) like minute-level or second-level, you could set a relatively higher value of `slidingWindow`.
    1. The trade-off between training/inference time and potential performance improvement. A larger `slidingWindow` may cause longer training/inference time. There is **no guarantee** that larger `slidingWindow`s will lead to accuracy gains. A small `slidingWindow` may cause the model difficult to converge to an optimal solution. For example, it is hard to detect anomalies when `slidingWindow` has only two points.

* `alignMode` - How to align multiple variables (time series) on timestamps. There are two options for this parameter, `Inner` and `Outer`, and the default value is `Outer`.

    This parameter is critical when there is misalignment between timestamp sequences of the variables. The model needs to align the variables onto the same timestamp sequence before further processing.

    `Inner` means the model will report detection results only on timestamps on which **every time series** has a value, i.e. the intersection of all variables. `Outer` means the model will report detection results on timestamps on which **any time series** has a value, i.e. the union of all variables.

    Here is an example to explain different `alignModel` values.

    *Variable-1*

    |timestamp | value|
    ----------| -----|
    |2020-11-01| 1  
    |2020-11-02| 2  
    |2020-11-04| 4  
    |2020-11-05| 5

    *Variable-2*

    timestamp | value  
    --------- | -
    2020-11-01| 1  
    2020-11-02| 2  
    2020-11-03| 3  
    2020-11-04| 4

    *`Inner` join two variables*

    timestamp | Variable-1 | Variable-2
    ----------| - | -
    2020-11-01| 1 | 1
    2020-11-02| 2 | 2
    2020-11-04| 4 | 4

    *`Outer` join two variables*

    timestamp | Variable-1 | Variable-2
    --------- | - | -
    2020-11-01| 1 | 1
    2020-11-02| 2 | 2
    2020-11-03| NA | 3
    2020-11-04| 4 | 4
    2020-11-05| 5 | NA

* `fillNAMethod` - How to fill `nan` in the merged table. There might be still missing values in the merged table and they should be properly handled. We provide several methods to fill up them. The options are `Linear`, `Previous`, `Subsequent`,  `Zero`, and `Fixed` and the default value is `Linear`.

    | Option     | Method                                                                                           |
    | ---------- | -------------------------------------------------------------------------------------------------|
    | `Linear`     | Fill NA values by linear interpolation                                                           |
    | `Previous`   | Propagate last valid value to fill gaps. Example: `[1, 2, nan, 3, nan, 4]` -> `[1, 2, 2, 3, 3, 4]` |
    | `Subsequent` | Use next valid value to fill gaps. Example: `[1, 2, nan, 3, nan, 4]` -> `[1, 2, 3, 3, 4, 4]`       |
    | `Zero`       | Fill NA values with 0.                                                                           |
    | `Fixed`      | Fill NA values with a specified valid value that should be provided in `paddingValue`.          |

* `paddingValue` - Padding value is used to fill `nan` when `fillNAMethod` is `Fixed` and must be provided in that case. In other cases it is optional.

* `displayName` - This is an optional parameter which is used to identify models. For example, you can use it to mark parameters, data sources, and any other meta data about the model and its input data. The default value is an empty string.
