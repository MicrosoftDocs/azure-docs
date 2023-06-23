---
title: Global parameters
description: Set global parameters for each of your Azure Data Factory environments
ms.service: data-factory
ms.subservice: authoring
ms.topic: conceptual
author: nabhishek
ms.author: abnarain
ms.date: 05/05/2023
ms.custom:
---

# Global parameters in Azure Data Factory

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

Global parameters are constants across a data factory that can be consumed by a pipeline in any expression. They're useful when you have multiple pipelines with identical parameter names and values. When promoting a data factory using the continuous integration and deployment process (CI/CD), you can override these parameters in each environment. 

## Creating global parameters

To create a global parameter, go to the *Global parameters* tab in the **Manage** section. Select **New** to open the creation side-nav.

:::image type="content" source="media/author-global-parameters/create-global-parameter-1.png" alt-text="Screenshot that highlights the New button you select to create global parameters.":::

In the side-nav, enter a name, select a data type, and specify the value of your parameter.

:::image type="content" source="media/author-global-parameters/create-global-parameter-2.png" alt-text="Screenshot that shows where you add the name, data type, and value for the new global parameter.":::

After a global parameter is created, you can edit it by clicking the parameter's name. To alter multiple parameters at once, select **Edit all**.

:::image type="content" source="media/author-global-parameters/create-global-parameter-3.png" alt-text="Create global parameters":::


## Using global parameters in a pipeline

Global parameters can be used in any [pipeline expression](control-flow-expression-language-functions.md). If a pipeline is referencing another resource such as a dataset or data flow, you can pass down the global parameter value via that resource's parameters. Global parameters are referenced as `pipeline().globalParameters.<parameterName>`.

:::image type="content" source="media/author-global-parameters/expression-global-parameters.png" alt-text="Using global parameters":::

## <a name="cicd"></a> Global parameters in CI/CD

We recommend including global parameters in the ARM template during the CI/CD. The new mechanism of including global parameters in the ARM template (from 'Manage hub' -> 'ARM template' -> ‘Include global parameters in ARM template
') as illustrated below, will not conflict/ override the factory-level settings as it used to do earlier, hence not requiring additional PowerShell for global parameters deployment during CI/CD.

:::image type="content" source="media/author-global-parameters/include-arm-template.png" alt-text="Screenshot of 'Include in ARM template'.":::

> [!NOTE]
> We have moved the UI experience for including global parameters from the 'Global parameters' section to the 'ARM template' section in the manage hub. 
If you are already using the older mechanism (from 'Manage hub' -> 'Global parameters' -> 'Include in ARM template'), you can continue. We will continue to support it. 

If you are using the older flow of integrating global parameters in your continuous integration and deployment solution, it will continue to work:

* Include global parameters in the ARM template (from 'Manage hub' -> 'Global parameters' -> 'Include in ARM template')
:::image type="content" source="media/author-global-parameters/include-arm-template-deprecated.png" alt-text="Screenshot of deprecated 'Include in ARM template'.":::

* Deploy global parameters via a PowerShell script

We strongly recommend using the new mechanism of including global parameters in the ARM template (from 'Manage hub' -> 'ARM template' -> 'Include global parameters in an ARM template') since it makes the CICD with global parameters much more straightforward and easier to manage.

> [!NOTE]
> The **Include global parameters in an ARM template** configuration is only available in "Git mode". Currently it is disabled in "live mode" or "Data Factory" mode.  

> [!WARNING]
>You cannot use  ‘-‘ in the parameter name. You will receive an errorcode "{"code":"BadRequest","message":"ErrorCode=InvalidTemplate,ErrorMessage=The expression >'pipeline().globalParameters.myparam-dbtest-url' is not valid: .....}". But, you can use the ‘_’ in the parameter name. 



## Next steps

* Learn about Azure Data Factory's [continuous integration and deployment process](continuous-integration-delivery-improvements.md)
* Learn how to use the [control flow expression language](control-flow-expression-language-functions.md)
