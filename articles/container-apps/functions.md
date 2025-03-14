---
title: Create an Azure Functions app with auto scaling rules on Azure Container Apps
description: Learn to create an Azure Functions app pre-configured with auto scaling rules in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic:  reference
ms.date: 03/14/2025
ms.author: cshoe
---

# Create an Azure Functions app with auto scaling rules on Azure Container Apps

1. Go to the Azure portal and search for **Container Apps** in the search bar.

1. Select **Create**.

1. Select **Container App**

1. In the *Basics* tab, enter the following values.

    Under *Project details*:

    | Property | Value |
    |---|---|
    | Subscription | Select your Azure subscription. |
    | Resource group | Select **Create new resource group**, name it **my-aca-functions-group**, and select **OK**.  |
    | Container app name | Enter **my-aca-functions-app**. |

1. Next to *Optimize for Azure Functions* check the checkbox.

1. Under *Container Apps environment* enter:

    | Property | Value |
    |---|---|
    | Region | Select a region closest to you. |
    | Container Apps environment | Select **Create new environment**. |

1. In the environment setup window, enter:

    | Property | Value |
    |---|---|
    | Environment name | Enter **my-aca-functions-environment**. |
    | Zone redundancy | Disabled |

1. Select **Create** to save your values.

1. Select **Next: Container** to switch to the *Container* tab.

1. In the *Container* tab, enter the following values:

1. Next to *Use quickstart image*, leave this box unchecked.

1. Under the *Container details* section, enter the following values.

    | Property | value |
    |---|---|
    | Name | This bx is pre-filled with your selection in the last section. |
    | Image source | Select **Docker Hub or other registries** |
    | Subscription  | Select your subscription |
    | Image type | Select **Public**. |
    | Registry login server  | Enter **mcr.microsoft.com** |
    | Image and tag | Enter **azure-functions/dotnet8-quickstart-demo:1.0** |

1. For *Development stack*, select **.NET**

Select **Review + Create**.