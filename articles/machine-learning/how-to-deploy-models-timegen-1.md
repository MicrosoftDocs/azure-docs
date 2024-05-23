---
title: How to deploy TimeGEN-1 model with Azure Machine Learning
titleSuffix: Azure Machine Learning
description: Learn how to deploy TimeGEN-1 with Azure Machine Learning studio.
manager: scottpolly
ms.service: machine-learning
ms.subservice: inferencing
ms.topic: how-to
ms.date: 5/21/2024
ms.author: kritifaujdar
author: fkriti
ms.reviewer: mopeakande
reviewer: msakande
ms.custom: [references_regions]
---

# How to deploy a TimeGEN-1 model with Azure Machine Learning

In this article, you learn how to use Azure Machine Learning to deploy the TimeGEN-1 model as a serverless API with pay-as-you-go billing.
You filter on the Nixtla collection to browse the TimeGEN-1 model in the [model catalog](concept-model-catalog.md).

The Nixtla TimeGEN-1 is a generative, pretrained forecasting and anomaly detection model for time series data. TimeGEN-1 can produce accurate forecasts for new time series without training, using only historical values and exogenous covariates as inputs.

[!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

## Deploy TimeGEN-1 as a serverless API

Certain models in the model catalog can be deployed as a serverless API with pay-as-you-go billing. This kind of deployment provides a way to consume models as an API without hosting them on your subscription, while keeping the enterprise security and compliance that organizations need. This deployment option doesn't require quota from your subscription.

You can deploy TimeGEN-1 as a serverless API with pay-as-you-go billing. Nixtla offers TimeGEN-1 through the Microsoft Azure Marketplace. Nixtla can change or update the terms of use and pricing of this model.

### Prerequisites

- An Azure subscription with a valid payment method. Free or trial Azure subscriptions don't work. If you don't have an Azure subscription, create a [paid Azure account](https://azure.microsoft.com/pricing/purchase-options/pay-as-you-go) to begin.
- An Azure Machine Learning workspace. If you don't have a workspace, use the steps in the [Quickstart: Create workspace resources](quickstart-create-resources.md) article to create one. The serverless API model deployment offering for TimeGEN-1 is only available with workspaces created in these regions:

    > [!div class="checklist"]
    > * East US
    > * East US 2
    > * North Central US
    > * South Central US
    > * West US
    > * West US 3
    > * Sweden Central

    For a list of  regions that are available for each of the models supporting serverless API endpoint deployments, see [Region availability for models in serverless API endpoints](concept-endpoint-serverless-availability.md).

- Azure role-based access controls (Azure RBAC) are used to grant access to operations in Azure Machine Learning. To perform the steps in this article, your user account must be assigned the __Azure AI Developer role__ on the resource group. For more information on permissions, see [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md).


### Create a new deployment

These steps demonstrate the deployment of TimeGEN-1. To create a deployment:

1. Go to [Azure Machine Learning studio](https://ml.azure.com/home).
1. Select the workspace in which you want to deploy your models. To use the serverless API model deployment offering, your workspace must belong to one of the regions listed in the [Prerequisites](#prerequisites) section.
1. Choose the model **TimeGEN-1**, from the [model catalog](https://ml.azure.com/model/catalog). 
1. On the model's overview page in the model catalog, select **Deploy** to open up the serverless API deployment window.

   Alternatively, you can initiate deployment by going to your workspace and selecting **Endpoints** > **Serverless endpoints** > **Create**. Then, you can select a model.

1. In the deployment wizard, select the link to **Azure Marketplace Terms**, to learn more about the terms of use.
1. You can also select the **Pricing and terms** tab to learn about pricing for the selected model.
1. Select the **Subscribe and Deploy** button. If this is your first time deploying the model in the workspace, you have to subscribe your workspace for the particular offering. This step requires that your account has the **Azure AI Developer role** permissions on the resource group, as listed in the prerequisites. Each workspace has its own subscription to the particular Azure Marketplace offering of the model, which allows you to control and monitor spending. Currently, you can have only one deployment for each model within a workspace.
1. Once you subscribe the workspace for the particular Azure Marketplace offering, subsequent deployments of the _same_ offering in the _same_ workspace don't require subscribing again. If this scenario applies to you, you'll see a **Continue to deploy** option to select.
1. Give the deployment a name. This name becomes part of the deployment API URL. This URL must be unique in each Azure region. 
1. Select **Deploy**. Wait until the deployment is ready and you're redirected to the Deployments page.
1. Take note of the **Target URI** and the secret **Key**, which you can use to call the deployment and generate completions. For more information on using the APIs, see the [reference](#reference-for-timegen-1-deployed-as-a-serverless-api) section.
1. Select the **Test** tab to start interacting with the model.  
1. You can always find the endpoint's details, URI, and access keys by navigating to **Workspace** > **Endpoints** > **Serverless endpoints**.

To learn about billing for the TimeGEN-1 model deployed as a serverless API with pay-as-you-go token-based billing, see [Cost and quota considerations for TimeGEN-1 deployed as a serverless API](#cost-and-quota-considerations-for-timegen-1-deployed-as-a-serverless-api).

### Consume the TimeGEN-1 model as a service

You can consume TimeGEN-1 models by using the forecast API.

1. In the **workspace**, select **Endpoints** > **Serverless endpoints**.

1. Find and select the deployment you created.

1. Copy the **Target** URI and the **Key** token values.

1. Try the samples here:

| Use Case | Description | Sample Notebook |
| --------------- | --------------- | --------------- |
|Quick Start Forecast|The Nixtla TimeGEN1 is a generative, pretrained forecasting model for time series data. TimeGEN1 can produce accurate forecasts for new time series without training, using only historical values as inputs.|[Quick Start Forecast](https://aka.ms/quick-start-forecasting)|
|Fine-tuning|Fine-tuning is a powerful process to utilize Time-GEN1 more effectively. Foundation models - for example, TimeGEN1 - are pretrained on vast amounts of data, to capture wide-ranging features and patterns. These models can then be specialized for specific contexts or domains. Fine-tuning refines the model parameters to forecast a new task, allowing it to tailor its vast pre-existing knowledge towards the requirements of the new data. In this way, fine-tuning serves as a crucial bridge, linking the broad TimeGEN1 capabilities to the specifics of your tasks. Concretely, the fine-tuning process involves performing some training iterations on your input data, to minimize the forecasting error. The forecasts are produced with the updated model. To control the number of iterations, use the finetune_steps argument of the forecast method.|[Fine-tuning](https://aka.ms/finetuning-TimeGEN1)|
|Anomaly Detection|Anomaly detection in time series data is important across various industries - for example, finance and healthcare. It involves monitoring ordered data points to spot irregularities that might signal issues or threats. Organizations can then swiftly act to prevent, improve, or safeguard their operations.|[Anomaly Detection](https://aka.ms/anomaly-detection)|
|Exogenous Variables|Exogenous variables are external factors that can influence forecasts. These variables take on one of a limited, fixed number of possible values, and induce a grouping of your observations. For example, if you're forecasting daily product demand for a retailer, you could benefit from an event variable that may tell you what kind of event takes place on a given day, for example 'None', Sporting', or 'Cultural'. Or you might also include external factors such as weather.|[Exogenous Variables](https://aka.ms/exogenous-variables)|
|Demand Forecasting|Demand forecasting involves application of historical data and other analytical information, to build models that help predict future estimates of customer demand, for specific products, over a specific time period. It helps shape product road map, inventory production, and inventory allocation, among other things.|[Demand Forecasting](https://aka.ms/demand-forecasting-with-TimeGEN1)|

For more information about use of the APIs, visit the [Reference](#reference-for-timegen-1-deployed-as-a-serverless-api) section.

### Reference for TimeGEN-1 deployed as a serverless API

#### Forecast API

Use the method `POST` to send the request to the `/forecast_multi_series` route:

__Request__

```rest
POST /forecast_multi_series HTTP/1.1
Host: <DEPLOYMENT_URI>
Authorization: Bearer <TOKEN>
Content-type: application/json
```

#### Request schema

The Payload JSON formatted string contains these parameters:

| Key | Type | Default | Description |
|-----|-----|-----|-----|
| **DataFrame (`df`)**    | `DataFrame`  | No default. This value must be specified.  | The DataFrame on which the function operates. Expected to contain at least these columns:<br><br>`time_col`: Column name in `df` that contains the time indices of the time series. This column is typically a datetime column with regular intervals - for example, hourly, daily, monthly data points.<br><br>`target_col`: Column name in `df` that contains the target variable of the time series, in other words, the variable we wish to predict or analyze.<br><br>Additionally, you can pass multiple time series (stacked in the dataframe) considering another column:<br><br>`id_col`: Column name in `df` that identifies unique time series. Each unique value in this column corresponds to a unique time series.|
| **Forecast Horizon (`h`)**     | `int` | No default. This value must be specified. | Forecast horizon |
| **Frequency (`freq`)** | `str` | None    |Frequency of the data. By default, the frequency is inferred automatically. For more information, visit [pandas available frequencies](https://pandas.pydata.org/pandas-docs/stable/user_guide/timeseries.html#offset-aliases). |
| **Identifying Column (`id_col`)**       | `str` | `unique_id`    | Column that identifies each series.|
|**Time Column (`time_col`)**| `str`  |`ds`    | Column that identifies each timestep; its values can be timestamps or integers.  |
| **Target Column (`target_col`)**         | `str` | `y`  | Column that contains the target. |
| **Exogenous DataFrame (`X_df`)**| `DataFrame`| None  | DataFrame with `[unique_id, ds]` columns and the `df` future exogenous variables. |
|**Prediction Intervals (`level`)**|`List[Union[int, float]]`|None|Confidence levels between 0 and 100 for prediction intervals.|
|**Quantiles (`quantiles`)**|`List[float]`|None|List of quantiles to forecast between (0, 1). `level` and `quantiles` shouldn't be used simultaneously. The output dataframe has the quantile columns formatted as `TimeGEN-q-(100 * q)` for each q value. The term 100 * q represents percentiles, but we choose this notation to avoid the appearance of dots in column names.|
|**Fine-tuning Steps (`finetune_steps`)**|`int`|0|Number of steps used to fine-tune learning TimeGEN-1 in the new data.|
|**Fine-tuning Loss (`finetune_loss`)**|`str`|`default`|Loss function to use for fine-tuning. Options: `mae`, `mse`, `rmse`, `mape`, `smape`|
|**Clean Exogenous First (`clean_ex_first`)**|`bool`|True|Clean exogenous signal before making forecasts using TimeGEN-1.|
|**Validate API Key (`validate_api_key`)**|`bool`|False|If true, validates API key before sending requests.|
|**Add History (`add_history`)**|`bool`|False|Return fitted values of the model.|
|**Date Features (`date_features`)**|`Union`|False|Features computed from the dates. Can be pandas date attributes or functions that take the dates as input. If true, automatically adds the most used date features for the frequency of `df`.|
|**One-Hot Encoding Date Features (`date_features_to_one_hot`)**|`Union`|True|Apply one-hot encoding to these date features. If `date_features=True` then all date features are one-hot encoded by default.|
|**Model (`model`)**|`str`|`azureai`|`azureai`|
|**Number of Partitions (`num_partitions`)**|`int`|None|Number of partitions to use. If none, the number of partitions matches the available parallel resources in distributed environments.|

#### Example

```json
payload = {
    "model": "azureai",
    "freq": "D",
    "fh": 7,
    "y": {
        "2015-12-02": 8.71177264560569,
        "2015-12-03": 8.05610965954506,
        "2015-12-04": 8.08147504013705,
        "2015-12-05": 7.45876269238096,
        "2015-12-06": 8.01400499477946,
        "2015-12-07": 8.49678638163858,
        "2015-12-08": 7.98104975966596,
        "2015-12-09": 7.77779262633883,
        "2015-12-10": 8.2602342916073,
        "2015-12-11": 7.86633892304654,
        "2015-12-12": 7.31055015853442,
        "2015-12-13": 7.71824095195932,
        "2015-12-14": 8.31947369244219,
        "2015-12-15": 8.23668532271246,
        "2015-12-16": 7.80751004221619,
        "2015-12-17": 7.59186171488993,
        "2015-12-18": 7.52886925664225,
        "2015-12-19": 7.17165682276851,
        "2015-12-20": 7.89133075766189,
        "2015-12-21": 8.36007143564403,
        "2015-12-22": 8.11042723757502,
        "2015-12-23": 7.77527584648686,
        "2015-12-24": 7.34729970074316,
        "2015-12-25": 7.30182234213793,
        "2015-12-26": 7.12044437239249,
        "2015-12-27": 8.87877607170755,
        "2015-12-28": 9.25061821847475,
        "2015-12-29": 9.24792513230345,
        "2015-12-30": 8.39140318535794,
        "2015-12-31": 8.00469951054955,
        "2016-01-01": 7.58933582317062,
        "2016-01-02": 7.82524529143177,
        "2016-01-03": 8.24931374626064,
        "2016-01-04": 9.29514097366865,
        "2016-01-05": 8.56826646160024,
        "2016-01-06": 8.35255436947459,
        "2016-01-07": 8.29579811063615,
        "2016-01-08": 8.29029259122431,
        "2016-01-09": 7.78572089653462,
        "2016-01-10": 8.28172399041139,
        "2016-01-11": 8.4707303170059,
        "2016-01-12": 8.13505390861157,
        "2016-01-13": 8.06714903991011
    },
    "clean_ex_first": True,
    "finetune_steps": 0,
    "finetune_loss": "default"
}
```

#### Response schema

The response is a data frame of type `pandas.DataFrame` that contains the TimeGEN-1 forecasts for point predictions and probabilistic predictions.

#### Example

This JSON sample is an example response:

```json
{
  "status": 200,
  "data": {
    "timestamp": [
      "2016-01-14 00:00:00",
      "2016-01-15 00:00:00",
      "2016-01-16 00:00:00",
      "2016-01-17 00:00:00",
      "2016-01-18 00:00:00",
      "2016-01-19 00:00:00",
      "2016-01-20 00:00:00"
    ],
    "value": [
      7.960582256317139,
      7.7414960861206055,
      7.728490352630615,
      8.267574310302734,
      8.543140411376953,
      8.298713684082031,
      8.105557441711426
    ],
    "input_tokens": 43,
    "output_tokens": 7,
    "finetune_tokens": 0
  },
  "message": "success",
  "details": "request successful",
  "code": "B10",
  "support": "If you have questions or need support, please email ops@nixtla.io",
  "requestID": "2JHQL2LDUX"
}
```

## Cost and quotas

### Cost and quota considerations for TimeGEN-1 deployed as a serverless API

Nixtla offers TimeGEN-1 deployed as a serverless API through the Azure Marketplace. TimeGEN-1 is integrated with Azure Machine Learning for use. You can find more information about Azure Marketplace pricing when you deploy the model.

Each time a workspace subscribes to a given offer from the Azure Marketplace, a new resource is created to track the costs associated with its consumption. The same resource is used to track costs associated with inference; however, multiple meters are available to track each scenario independently.

For more information about how to track costs, visit [Monitor costs for models offered through the Azure Marketplace](../ai-studio/how-to/costs-plan-manage.md#monitor-costs-for-models-offered-through-the-azure-marketplace).

Quota is managed per deployment. Each deployment has a rate limit of 200,000 tokens per minute and 1,000 API requests per minute. However, we currently limit one deployment per model per workspace. Contact Microsoft Azure Support if the current rate limits are insufficient for your scenarios.

## Related content

- [Model Catalog and Collections](concept-model-catalog.md)
- [Deploy and score a machine learning model by using an online endpoint](how-to-deploy-online-endpoints.md)
- [Plan and manage costs for Azure AI Studio](concept-plan-manage-cost.md)