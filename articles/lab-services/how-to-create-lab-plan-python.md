---
title: Create a lab plan using Python
titleSuffix: Azure Lab Services
description: Learn how to create an Azure Lab Services lab plan using Python and the Azure Python SDK. 
author: RogerBestMSFT
ms.topic: how-to
ms.custom: devx-track-python
ms.date: 02/15/2022
---

# Create a lab plan in Azure Lab Services using Python and the Azure libraries (SDK) for Python

In this article, you learn how to use Python and the Azure Python SDK to create a lab plan.  Lab plans are used when creating labs for Azure Lab Services.  You'll also add a role assignment so an educator can create labs based on the lab plan.  For an overview of Azure Lab Services, see [An introduction to Azure Lab Services](lab-services-overview.md).

## Prerequisites

[!INCLUDE [Azure subscription](./includes/lab-services-prerequisite-subscription.md)]
[!INCLUDE [Create and manage labs](./includes/lab-services-prerequisite-create-lab.md)]

- [Setup Local Python dev environment for Azure](/azure/developer/python/configure-local-development-environment).
- [The requirements.txt can be downloaded from the Azure Python samples](https://github.com/Azure-Samples/azure-samples-python-management/blob/main/samples/labservices/requirements.txt)

## Create a lab plan

The following steps will show you how to create a lab plan.  Any properties set in the lab plan will be used in labs created with this plan.

```python
# --------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for
# license information.
# --------------------------------------------------------------------------

import os
import time
from datetime import timedelta
from azure.identity import DefaultAzureCredential
from azure.mgmt.labservices import LabServicesClient
from azure.mgmt.resource import ResourceManagementClient

def main():

    SUBSCRIPTION_ID = "<Subscription ID>"
    TIME = str(time.time()).replace('.','')
    GROUP_NAME = "BellowsCollege_rg"
    LABPLAN = "BellowsCollege_labplan"
    LAB = "BellowsCollege_lab"
    LOCATION = 'southcentralus'    

    # Create clients
    # # For other authentication approaches, please see: https://pypi.org/project/azure-identity/
    resource_client = ResourceManagementClient(
        credential=DefaultAzureCredential(),
        subscription_id=SUBSCRIPTION_ID
    )
    
    labservices_client = LabServicesClient(
        credential=DefaultAzureCredential(),
        subscription_id=SUBSCRIPTION_ID
    )

    # Create resource group
    resource_client.resource_groups.create_or_update(
        GROUP_NAME,
        {"location": LOCATION}
    )

    # Create lab services lab plan
    LABPLANBODY = {
        "location" : LOCATION,
        "properties" : {
            "defaultConnectionProfile" : {
                "webSshAccess" : "None",
                "webRdpAccess" : "None",
                "clientSshAccess" : "None",
                "clientRdpAccess" : "Public"
            },
            "defaultAutoShutdownProfile" : {
                "shutdownOnDisconnect" : "Disabled",
                "shutdownWhenNotConnected" : "Disabled",
                "shutdownOnIdle" : "None"
            },
            "allowedRegions" : [LOCATION],
            "supportInfo" : {
                "email" : "user@bellowscollege.com",
                "phone" : "123-123-1234",
                "instructions" : "Bellows College support."
            }
        }
    }

    #Create Lab Plan
    poller = labservices_client.lab_plans.begin_create_or_update(
        GROUP_NAME,
        LABPLAN,
        LABPLANBODY
    )

    # Poll for long running execution.
    labplan_result = poller.result()
    print(f"Created Lab Plan: {labplan_result.name}")

    # Get LabServices Lab Plans by resource group
    labservices_client.lab_plans.list_by_resource_group(
        GROUP_NAME
    )

    #Get single LabServices Lab Plan
    labservices_labplan = labservices_client.lab_plans.get(GROUP_NAME, LABPLAN)

if __name__ == "__main__":
    main()
```

## Clean up resources

If you're not going to continue to use this application, delete the lab with the following steps:

```python
# --------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for
# license information.
# --------------------------------------------------------------------------

from datetime import timedelta
import time
from azure.identity import DefaultAzureCredential
from azure.mgmt.labservices import LabServicesClient
from azure.mgmt.resource import ResourceManagementClient

# - other dependence -
# - end -
#

def main():

    SUBSCRIPTION_ID = "<Subscription ID>"
    TIME = str(time.time()).replace('.','')
    GROUP_NAME = "BellowsCollege_rg" + TIME
    LABPLAN = "BellowsCollege_labplan" + TIME
    LAB = "BellowsCollege_lab" + TIME
    LOCATION = 'southcentralus'    

    # Create clients
    # # For other authentication approaches, please see: https://pypi.org/project/azure-identity/
    resource_client = ResourceManagementClient(
        credential=DefaultAzureCredential(),
        subscription_id=SUBSCRIPTION_ID
    )
    
    labservices_client = LabServicesClient(
        credential=DefaultAzureCredential(),
        subscription_id=SUBSCRIPTION_ID
    )

    # Delete Lab
    labservices_client.labs.begin_delete(
        GROUP_NAME,
        LAB
    ).result()
    print("Deleted lab.\n")

    # Delete Group
    resource_client.resource_groups.begin_delete(
        GROUP_NAME
    ).result()


if __name__ == "__main__":
    main()
```
## Next steps

In this article, you created a resource group and a lab plan.  As an admin, you can learn more about [Azure PowerShell module](/powershell/azure) and [Az.LabServices cmdlets](/powershell/module/az.labservices/).

> [!div class="nextstepaction"]
> [Create a lab using Python and the Azure Python SDK](how-to-create-lab-python.md)
