---
title: Differential privacy how-to - SmartNoise (preview)
titleSuffix: Azure Machine Learning
description: Learn how to apply differential privacy best practices to Azure Machine Learning models by using the SmartNoise open-source libraries.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.custom: responsible-ml
ms.author: slbird
author: slbird
ms.reviewer: luquinta
ms.date: 01/21/2020
# Customer intent: As an experienced data scientist, I want to use differential privacy in Azure Machine Learning.
---

# Use differential privacy in Azure Machine Learning (preview)

Learn how to apply differential privacy best practices to Azure Machine Learning models by using the SmartNoise Python open-source libraries.

Differential privacy is the gold-standard definition of privacy. Systems that adhere to this definition of privacy provide strong assurances against a wide range of data reconstruction and reidentification attacks, including attacks by adversaries who possess auxiliary information. Learn more about [how differential privacy works](./concept-differential-privacy.md).


## Prerequisites

- If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree) today.
- [Python 3](https://www.python.org/downloads/)

## Install SmartNoise Python libraries

### Standalone installation

The libraries are designed to work from distributed Spark clusters, and can be installed just like any other package.

The instructions below assume that your `python` and `pip` commands are mapped to `python3` and `pip3`.

Use pip to install the [SmartNoise Python packages](https://pypi.org/project/opendp-smartnoise/).

`pip install opendp-smartnoise`

To verify that the packages are installed, launch a python prompt and type:

```python
import opendp.smartnoise.core
import opendp.smartnoise.sql
```

If the imports succeed, the libraries are installed and ready to use.

### Docker image installation

You can also use SmartNoise packages with Docker.

Pull the `opendp/smartnoise` image to use the libraries inside a Docker container that includes Spark, Jupyter, and sample code.

```sh
docker pull opendp/smartnoise:privacy
```

Once you've pulled the image, launch the Jupyter server:

```sh
docker run --rm -p 8989:8989 --name smartnoise-run opendp/smartnoise:privacy
```

This starts a Jupyter server at port `8989` on your `localhost`, with password `pass@word99`. Assuming you used the command line above to start the container with name `smartnoise-privacy`, you can open a bash terminal in the Jupyter server by running:

```sh
docker exec -it smartnoise-run bash
```

The Docker instance clears all state on shutdown, so you will lose any notebooks you create in the running instance. To remedy this, you can bind mount a local folder to the container when you launch it:

```sh
docker run --rm -p 8989:8989 --name smartnoise-run --mount type=bind,source=/Users/your_name/my-notebooks,target=/home/privacy/my-notebooks opendp/smartnoise:privacy
```

Any notebooks you create under the *my-notebooks* folder will be stored in your local filesystem.

## Perform data analysis

To prepare a differentially private release, you need to choose a data source, a statistic, and some privacy parameters, indicating the level of privacy protection.  

This sample references the California Public Use Microdata (PUMS), representing anonymized records of citizen demographics:

```python
import os
import sys
import numpy as np
import opendp.smartnoise.core as sn

data_path = os.path.join('.', 'data', 'PUMS_california_demographics_1000', 'data.csv')
var_names = ["age", "sex", "educ", "race", "income", "married", "pid"]
```

In this example, we compute the mean and the variance of the age.  We use a total `epsilon` of 1.0 (epsilon is our privacy parameter, spreading our privacy budget across the two quantities we want to compute. Learn more about [privacy metrics](concept-differential-privacy.md#differential-privacy-metrics).

```python
with sn.Analysis() as analysis:
    # load data
    data = sn.Dataset(path = data_path, column_names = var_names)

    # get mean of age
    age_mean = sn.dp_mean(data = sn.cast(data['age'], type="FLOAT"),
                          privacy_usage = {'epsilon': .65},
                          data_lower = 0.,
                          data_upper = 100.,
                          data_n = 1000
                         )
    # get variance of age
    age_var = sn.dp_variance(data = sn.cast(data['age'], type="FLOAT"),
                             privacy_usage = {'epsilon': .35},
                             data_lower = 0.,
                             data_upper = 100.,
                             data_n = 1000
                            )
analysis.release()

print("DP mean of age: {0}".format(age_mean.value))
print("DP variance of age: {0}".format(age_var.value))
print("Privacy usage: {0}".format(analysis.privacy_usage))
```

The results look something like those below:

```text
DP mean of age: 44.55598845931517
DP variance of age: 231.79044646429134
Privacy usage: approximate {
  epsilon: 1.0
}
```

There are some important things to note about this example.  First, the `Analysis` object represents a data processing graph.  In this example, the mean and variance are computed from the same source node.  However, you can include more complex expressions that combine inputs with outputs in arbitrary ways.

The analysis graph includes `data_upper` and `data_lower` metadata, specifying the lower and upper bounds for ages.  These values are used to precisely calibrate the noise to ensure differential privacy.  These values are also used in some handling of outliers or missing values.

Finally, the analysis graph keeps track of the total privacy budget spent.

You can use the library to compose more complex analysis graphs, with several mechanisms, statistics, and utility functions:

| Statistics    | Mechanisms | Utilities  |
| ------------- |------------|------------|
| Count         | Gaussian   | Cast       |
| Histogram     | Geometric  | Clamping   |
| Mean          | Laplace    | Digitize   |
| Quantiles     |            | Filter     |
| Sum           |            | Imputation |
| Variance/Covariance |      | Transform  |

See the [data analysis notebook](https://github.com/opendifferentialprivacy/smartnoise-samples/blob/master/analysis/basic_data_analysis.ipynb) for more details.

## Approximate utility of differentially private releases

Because differential privacy operates by calibrating noise, the utility of releases may vary depending on the privacy risk.  Generally, the noise needed to protect each individual becomes negligible as sample sizes grow large, but overwhelm the result for releases that target a single individual.  Analysts can review the accuracy information for a release to determine how useful the release is:

```python
with sn.Analysis() as analysis:
    # load data
    data = sn.Dataset(path = data_path, column_names = var_names)

    # get mean of age
    age_mean = sn.dp_mean(data = sn.cast(data['age'], type="FLOAT"),
                          privacy_usage = {'epsilon': .65},
                          data_lower = 0.,
                          data_upper = 100.,
                          data_n = 1000
                         )
analysis.release()

print("Age accuracy is: {0}".format(age_mean.get_accuracy(0.05)))
```

The result of that operation should look similar to that below:

```text
Age accuracy is: 0.2995732273553991
```

This example computes the mean as above, and uses the `get_accuracy` function to request accuracy at `alpha` of 0.05. An `alpha` of 0.05 represents a 95% interval, in that released value will fall within the reported accuracy bounds about 95% of the time.  In this example, the reported accuracy is 0.3, which means the released value will be within an interval of width 0.6, about 95% of the time.  It is not correct to think of this value as an error bar, since the released value will fall outside the reported accuracy range at the rate specified by `alpha`, and values outside the range may be outside in either direction.

Analysts may query `get_accuracy` for different values of `alpha` to get narrower or wider confidence intervals, without incurring additional privacy cost.

## Generate a histogram

The built-in `dp_histogram` function creates differentially private histograms over any of the following data types:

- A continuous variable, where the set of numbers has to be divided into bins
- A boolean or dichotomous variable, that can only take on two values
- A categorical variable, where there are distinct categories enumerated as strings

Here is an example of an `Analysis` specifying bins for a continuous variable histogram:

```python
income_edges = list(range(0, 100000, 10000))

with sn.Analysis() as analysis:
    data = sn.Dataset(path = data_path, column_names = var_names)

    income_histogram = sn.dp_histogram(
            sn.cast(data['income'], type='int', lower=0, upper=100),
            edges = income_edges,
            upper = 1000,
            null_value = 150,
            privacy_usage = {'epsilon': 0.5}
        )
```

Because the individuals are disjointly partitioned among histogram bins, the privacy cost is incurred only once per histogram, even if the histogram includes many bins.

For more on histograms, see the [histograms notebook](https://github.com/opendifferentialprivacy/smartnoise-samples/blob/master/analysis/histograms.ipynb).

## Generate a covariance matrix

SmartNoise offers three different functionalities with its `dp_covariance` function:

- Covariance between two vectors
- Covariance matrix of a matrix
- Cross-covariance matrix of a pair of matrices

Here is an example of computing a scalar covariance:

```python
with sn.Analysis() as analysis:
    wn_data = sn.Dataset(path = data_path, column_names = var_names)

    age_income_cov_scalar = sn.dp_covariance(
      left = sn.cast(wn_data['age'], 
      type = "FLOAT"), 
      right = sn.cast(wn_data['income'], 
      type = "FLOAT"), 
      privacy_usage = {'epsilon': 1.0},
      left_lower = 0., 
      left_upper = 100., 
      left_n = 1000, 
      right_lower = 0., 
      right_upper = 500_000.,
      right_n = 1000)
```

For more information, see the [covariance notebook](
https://github.com/opendifferentialprivacy/smartnoise-samples/blob/master/analysis/covariance.ipynb)

## Next Steps

- Explore [SmartNoise sample notebooks](https://github.com/opendifferentialprivacy/smartnoise-samples/tree/master/analysis).