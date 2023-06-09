---
title: Create a lab using Python
titleSuffix: Azure Lab Services
description: Learn how to create an Azure Lab Services lab using Python and the Azure Python libraries (SDK).
author: RogerBestMSFT
ms.topic: how-to
ms.custom: devx-track-python
ms.date: 02/15/2022
---

# Create a lab in Azure Lab Services using Python and the Azure Python libraries (SDK)

In this article, you learn how to create a lab using Python and the Azure Python libraries (SDK).  The lab uses the settings from a previously created lab plan.  For detailed overview of Azure Lab Services, see [An introduction to Azure Lab Services](lab-services-overview.md).

## Prerequisites

[!INCLUDE [Azure subscription](./includes/lab-services-prerequisite-subscription.md)]
[!INCLUDE [Create and manage labs](./includes/lab-services-prerequisite-create-lab.md)]
[!INCLUDE [Existing lab plan](./includes/lab-services-prerequisite-lab-plan.md)]

- [Setup Local Python dev environment for Azure](/azure/developer/python/configure-local-development-environment).
- [The requirements.txt can be downloaded from the Azure Python samples](https://github.com/Azure-Samples/azure-samples-python-management/blob/main/samples/labservices/requirements.txt)

## Create a lab

Before you can create a lab, you need the lab plan object.  In the [create a lab plan by using Python](how-to-create-lab-plan-python.md), you learn how to create a lab plan named `BellowsCollege_labplan` in a resource group named `BellowsCollege_rg`.

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

    #Get single LabServices Lab Plan
    labservices_labplan = labservices_client.lab_plans.get(GROUP_NAME, LABPLAN)

    print("Get lab plans")
    print(labservices_labplan)

    #Get image information
    LABIMAGES = labservices_client.images.list_by_lab_plan(GROUP_NAME,LABPLAN)
    image = (list(filter(lambda x: (x.name == "microsoftwindowsdesktop.windows-11.win11-21h2-pro"), LABIMAGES)))
    
    #Get lab quota
    USAGEQUOTA = timedelta(hours=10)

    # Password
    CUSTOMPASSWORD = "<custom password>"
    # Create LabServices Lab
    LABBODY = {
        "name": LAB,
        "location" : LOCATION,
        "properties" : {
            "networkProfile": {},
            "connectionProfile" : {
                "webSshAccess" : "None",
                "webRdpAccess" : "None",
                "clientSshAccess" : "None",
                "clientRdpAccess" : "Public"
            },
            "AutoShutdownProfile" : {
                "shutdownOnDisconnect" : "Disabled",
                "shutdownWhenNotConnected" : "Disabled",
                "shutdownOnIdle" : "None"
            },
            "virtualMachineProfile" : {
                "createOption" : "TemplateVM",
                "imageReference" : {
                    "offer": image[0].offer,
                    "publisher": image[0].publisher,
                    "sku": image[0].sku,
                    "version": image[0].version
                },
                "sku" : {
                    "name" : "Classic_Fsv2_2_4GB_128_S_SSD",
                    "capacity" : 2
                },
                "additionalCapabilities" : {
                    "installGpuDrivers" : "Disabled"
                },
                "usageQuota" : USAGEQUOTA,
                "UseSharedPassword" : "Enabled",
                "adminUser" : {
                    "username" : "testuser",
                    "password" : CUSTOMPASSWORD
                }
            },
            "securityProfile" : {
                "openAccess" : "Disabled"
            },
            "rosterProfile" : {},
            "labPlanId" : labservices_labplan.id,
            "title" : "lab-python",
            "description" : "lab 99 description updated"
        }
    }

    poller = labservices_client.labs.begin_create_or_update(
        GROUP_NAME,
        LAB,
        LABBODY
    )

    lab_result = poller.result()
    print(f"Created Lab  {lab_result.name}")

    # Get LabServices Labs
    labservices_lab = labservices_client.labs.get(GROUP_NAME,LAB)
    print("Get lab:\n{}".format(labservices_lab))
    


if __name__ == "__main__":
    main()


```

## Clean up resources

If you're not going to continue to use this application, delete
the group and lab with the following steps:

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

As an admin, you can learn more about [Azure PowerShell module](/powershell/azure) and [Az.LabServices cmdlets](/powershell/module/az.labservices/).
