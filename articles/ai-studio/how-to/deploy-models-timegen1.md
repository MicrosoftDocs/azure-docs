---
title: How to deploy TimeGEN-1 model with Azure AI Studio
titleSuffix: Azure AI Studio
description: Learn how to deploy TimeGEN-1 with Azure AI Studio.
manager: scottpolly
ms.service: azure-ai-studio
ms.topic: how-to
ms.date: 4/29/2024
ms.reviewer: kritifaujdar 
reviewer: fkriti
ms.author: mopeakande
author: msakande
ms.custom: [references_regions]

---

# How to deploy a TimeGEN-1 model with Azure AI Studio

In this article, you learn how to use Azure AI Studio to deploy the TimeGEN-1 model as a service with pay-as you go billing.
You can browse the TimeGEN-1 model in the [Model Catalog](model-catalog.md) by filtering on the Nixtla collection.

Nixtla's TimeGEN-1 is a generative pretrained forecasting and anomaly detection model for time series data. TimeGEN-1 can produce accurate forecasts for new time series without training, using only historical values and exogenous covariates as inputs.

## Deploy TimeGEN-1 with pay-as-you-go

Certain models in the model catalog can be deployed as a service with pay-as-you-go. Pay-as-you-go deployment provides a way to consume models as an API without hosting them on your subscription, while keeping the enterprise security and compliance that organizations need. This deployment option doesn't require quota from your subscription.

TimeGEN-1 can be deployed as a service with pay-as-you-go and is offered by Nixtla through the Microsoft Azure Marketplace. Nixtla can change or update the terms of use and pricing of this model.

### Prerequisites

- An Azure subscription with a valid payment method. Free or trial Azure subscriptions won't work. If you don't have an Azure subscription, create a [paid Azure account](https://azure.microsoft.com/pricing/purchase-options/pay-as-you-go) to begin.
- An [AI Studio hub](../how-to/create-azure-ai-resource.md).

    > [!IMPORTANT]
    > The pay-as-you-go model deployment offering for TimeGEN1 is only available with hubs created in **East US 2** region.

- An [AI Studio project](../how-to/create-projects.md).
- Azure role-based access controls (Azure RBAC) are used to grant access to operations in Azure AI Studio. To perform the steps in this article, your user account must be assigned the __Azure AI Developer role__ on the resource group. For more information on permissions, see [Role-based access control in Azure AI Studio](../concepts/rbac-ai-studio.md).


### Create a new deployment

To create a deployment:

1. Sign in to [Azure AI Studio](https://ai.azure.com).
1. Select **Model catalog** from the **Explore** tab and search for *TimeGEN-1*. 

    Alternatively, you can initiate a deployment by starting from your project in AI Studio. From the **Build** tab of your project, select **Deployments** > **+ Create**.

1. In the model catalog, on the model's **Details** page, select **Deploy** and then **Pay-as-you-go**.
1. Select the project in which you want to deploy your model. To deploy the TimeGEN-1 model your project must be in the **East US 2** region.
1. In the deployment wizard, select the link to **Azure Marketplace Terms** to learn more about the terms of use.
1. You can also select the **Marketplace offer details** tab to learn about pricing for the selected model.
1. If this is your first time deploying the model in the project, you have to subscribe your project for the particular offering. This step requires that your account has the **Azure AI Developer role** permissions on the Resource Group, as listed in the prerequisites. Each project has its own subscription to the particular Azure Marketplace offering of the model, which allows you to control and monitor spending. Select **Subscribe and Deploy**. Currently you can have only one deployment for each model within a project.
1. Once you subscribe the project for the particular Azure Marketplace offering, subsequent deployments of the _same_ offering in the _same_ project don't require subscribing again. If this scenario applies to you, you'll see a **Continue to deploy** option to select (Currently you can have only one deployment for each model within a project).

1. Give the deployment a name. This name becomes part of the deployment API URL. This URL must be unique in each Azure region.

1. Select **Deploy**. Wait until the deployment is ready and you're redirected to the Deployments page.
1. You can return to the Deployments page, select the deployment, and note the endpoint's **Target** URL and the Secret **Key**.
1. You can always find the endpoint's details, URL, and access keys by navigating to the **Build** tab  and selecting **Deployments** from the Components section.

To learn about billing for TimeGEN-1 deployed with pay-as-you-go, see [Cost and quota considerations for TimeGEN-1 deployed as a service](#cost-and-quota-considerations-for-timegen1-deployed-as-a-service).

### Consume the TimeGEN-1 model as a service

TimeGEN-1 can be consumed using the chat API.

1. On the **Build** page, select **Deployments**.

1. Find and select the deployment you created.

1. Copy the **Target** URL and the **Key** value.

1.Try the samples here:
| Use Case | Description | Sample Notebook |
|Quick Start Forecast|Nixtla's TimeGEN1 is a generative pre-trained forecasting model for time series data. TimeGEN1 can produce accurate forecasts for new time series without training, using only historical values as inputs.|[Quick Start Forecast](https://aka.ms/quick-start-forecasting)|
|Finetunning|Fine-tuning is a powerful process for utilizing Time-GEN1 more effectively. Foundation models such as TimeGEN1 are pre-trained on vast amounts of data, capturing wide-ranging features and patterns. These models can then be specialized for specific contexts or domains. With fine-tuning, the model's parameters are refined to forecast a new task, allowing it to tailor its vast pre-existing knowledge towards the requirements of the new data. Fine-tuning thus serves as a crucial bridge, linking TimeGEN1's broad capabilities to your tasks specificities. Concretely, the process of fine-tuning consists of performing a certain number of training iterations on your input data minimizing the forecasting error. The forecasts will then be produced with the updated model. To control the number of iterations, use the finetune_steps argument of the forecast method.|[Finetuning](https://aka.ms/finetuning-TimeGEN1)|
|Anomaly Detection|Anomaly detection in time series data is crucial across various industries like finance and 
healthcare. It involves monitoring ordered data points to spot irregularities that may signal 
issues or threats. This enables organizations to act swiftly to prevent, improve or safeguard
their operations.|[Anomaly Detection](https://aka.ms/anomaly-detection)|
|Exogenous Variables|Calendar variables and special dates are one of the most common types of additional variables used in forecasting applications. They provide additional context on the current state of the time series, especially for window-based models such as TimeGEN1. These variables often include adding information on each observation's month, week, day, or hour. For example, in high-frequency hourly data, providing the current month of the year provides more context than the limited history available in the input window to improve the forecasts.|[Exogenous Variables](https://aka.ms/exogenous-variables)|
|Demand Forecasting|Demand forecasting is the process of leveraging historical data and other analytical information to build models that help predict future estimates of customer demand for specific products over a specific period. It helps shape product road map, inventory production and inventory allocation, among other things.|[Demand Forecasting](https://aka.ms/demand-forecasting-with-TimeGEN1)|

    For more information on using the APIs, see the [reference](#reference-for-timegen1-deployed-as-a-service) section.

### Reference for TimeGEN-1 deployed as a service

#### Request schema

Payload is a JSON formatted string containing the following parameters:

| Key | Type | Default | Description |
|-----|-----|-----|-----|
| **DataFrame (`df`)**    | `DataFrame`  | No default. This value must be specified.  | - Description: The DataFrame on which the function will operate. Expected to contain at least the following columns:
- `time_col`: Column name in `df` that contains the time indices of the time series. This is typically a datetime column with regular intervals, e.g., hourly, daily, monthly data points.
- `target_col`: Column name in `df` that contains the target variable of the time series, i.e., the variable we wish to predict or analyze.
Additionally, you can pass multiple time series (stacked in the dataframe) considering an additional column:
- `id_col`: Column name in `df` that identifies unique time series. Each unique value in this column corresponds to a unique time series.
 |
| **Forecast Horizon (`h`)**     | `int` | No default. This value must be specified. | Forecast horizon |
| **Frequency (`freq`)** | `str` | None    |Frequency of the data. By default, the frequency will be inferred automatically. [See pandas' available frequencies](https://pandas.pydata.org/pandas-docs/stable/user_guide/timeseries.html#offset-aliases). |
| **Identifying Column (`id_col`)**       | `str` | `unique_id`    | Column that identifies each series.|
|**Time Column (`time_col`)**| `str`  |`ds`    | Column that identifies each timestep; its values can be timestamps or integers.  |
| **Target Column (`target_col`)**         | `str` | `y`  | Column that contains the target. |
| **Exogenous DataFrame (`X_df`)**| `DataFrame`| None  | DataFrame with `[unique_id, ds]` columns and `df`'s future exogenous variables. |
|**Prediction Intervals (`level`)**|`List[Union[int, float]]`|None|Confidence levels between 0 and 100 for prediction intervals.|
|**Quantiles (`quantiles`)**|`List[float]`|None|List of quantiles to forecast between (0, 1). `level` and `quantiles` should not be used simultaneously. The output dataframe will have the quantile columns formatted as `TimeGEN-q-(100 * q)` for each q. 100 * q represents percentiles but we choose this notation to avoid having dots in column names.|
|**Fine-tuning Steps (`finetune_steps`)**|`int`|0|Number of steps used to fine-tune learning TimeGEN-1 in the new data.|
|**Fine-tuning Loss (`finetune_loss`)**|`str`|`default`|Loss function to use for fine-tuning. Options: `mae`, `mse`, `rmse`, `mape`, `smape`|
|**Clean Exogenous First (`clean_ex_first`)**|`bool`|True|Clean exogenous signal before making forecasts using TimeGEN-1.|
|**Validate API Key (`validate_api_key`)**|`bool`|False|If true, validates API key before sending requests.|
|**Add History (`add_history`)**|`bool`|False|Return fitted values of the model.|
|**Date Features (`date_features`)**|`Union`|False|Features computed from the dates. Can be pandas date attributes or functions that will take the dates as input. If true, automatically adds most used date features for the frequency of `df`.|
|**One-Hot Encoding Date Features (`date_features_to_one_hot`)**|`Union`|True|Apply one-hot encoding to these date features. If `date_features=True` then all date features are one-hot encoded by default.|
|**Model (`model`)**|`str`|`azureai`|`azureai`|
|**Number of Partitions (`num_partitions`)**|`int`|None|Number of partitions to use. If none, the number of partitions will be equal to the available parallel resources in distributed environments.|

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

The response is a data frame of type `pandas.DataFrame` which containes the TimeGEN-1 forecasts for point predictions and probabilistic predictions.

#### Example

The following JSON is an example response:

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

### Cost and quota considerations for TimeGEN-1 deployed as a service

TimeGEN-1 deployed as a service are offered by Nixtla through the Azure Marketplace and integrated with Azure AI Studio for use. You can find the Azure Marketplace pricing when deploying the model.

Each time a project subscribes to a given offer from the Azure Marketplace, a new resource is created to track the costs associated with its consumption. The same resource is used to track costs associated with inference; however, multiple meters are available to track each scenario independently.

For more information on how to track costs, see [monitor costs for models offered throughout the Azure Marketplace](./costs-plan-manage.md#monitor-costs-for-models-offered-through-the-azure-marketplace).

Quota is managed per deployment. Each deployment has a rate limit of 200,000 tokens per minute and 1,000 API requests per minute. However, we currently limit one deployment per model per project. Contact Microsoft Azure Support if the current rate limits aren't sufficient for your scenarios.

## Content filtering

Models deployed as a service with pay-as-you-go are protected by [Azure AI Content Safety](../../ai-services/content-safety/overview.md). With Azure AI content safety, both the prompt and completion pass through an ensemble of classification models aimed at detecting and preventing the output of harmful content. The content filtering system detects and takes action on specific categories of potentially harmful content in both input prompts and output completions. Learn more about [content filtering here](../concepts/content-filtering.md).

## Related content


- [What is Azure AI Studio?](../what-is-ai-studio.md)
- [Azure AI FAQ article](../faq.yml)
