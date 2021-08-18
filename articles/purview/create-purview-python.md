---
title: 'Quickstart: Create an Purview Account using Python'
description: Create an Azure Purview Account using Python.
author: nayenama
ms.author: nayenama
ms.service: purview
ms.subservice: purview-data-catalog
ms.devlang: python
ms.topic: quickstart
ms.date: 04/02/2021
---

# Quickstart: Create a Purview Account using Python

In this quickstart, you create a Purview account using Python. 

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* Your own [Azure Active Directory tenant](../active-directory/fundamentals/active-directory-access-create-new-tenant.md).

* Your account must have permission to create resources in the subscription

* If you have **Azure Policy** blocking all applications from creating **Storage account** and **EventHub namespace**, you need to make policy exception using tag, which can be entered during the process of creating a Purview account. The main reason is that for each Purview Account created, it needs to create a managed Resource Group and within this resource group, a Storage account and an
EventHub namespace. For more information refer to [Create Catalog Portal](create-catalog-portal.md)


## Install the Python package

1. Open a terminal or command prompt with administrator privileges. 
2. First, install the Python package for Azure management resources:

    ```python
    pip install azure-mgmt-resource
    ```
3. To install the Python package for Purview, run the following command:

    ```python
    pip install azure-mgmt-purview
    ```

    The [Python SDK for Purview](https://github.com/Azure/azure-sdk-for-python) supports Python 2.7, 3.3, 3.4, 3.5, 3.6 and 3.7.

4. To install the Python package for Azure Identity authentication, run the following command:

    ```python
    pip install azure-identity
    ```
    > [!NOTE] 
    > The "azure-identity" package might have conflicts with "azure-cli" on some common dependencies. If you meet any authentication issue, remove "azure-cli" and its dependencies, or use a clean machine without installing "azure-cli" package to make it work.
    
## Create a purview client

1. Create a file named **purview.py**. Add the following statements to add references to namespaces.

    ```python
    from azure.identity import ClientSecretCredential 
	from azure.mgmt.resource import ResourceManagementClient
	from azure.mgmt.purview import PurviewManagementClient
	from azure.mgmt.purview.models import *
	from datetime import datetime, timedelta
	import time
    ```

2. Add the following code to the **Main** method that creates an instance of PurviewManagementClient class. You use this object to create a purview account, delete purview account, check name availability and other resource provider operations.
 
    ```python
    def main():
    
    # Azure subscription ID
    subscription_id = '<subscription ID>'
	
	# This program creates this resource group. If it's an existing resource group, comment out the code that creates the resource group
    rg_name = '<resource group>'

    # The purview name. It must be globally unique.
    purview_name = '<purview account name>'

    # Location name, where Purview account must be created.
    location = '<location name>'    

    # Specify your Active Directory client ID, client secret, and tenant ID
    credentials = ClientSecretCredential(client_id='<service principal ID>', client_secret='<service principal key>', tenant_id='<tenant ID>') 
    # resource_client = ResourceManagementClient(credentials, subscription_id)
    purview_client = PurviewManagementClient(credentials, subscription_id)
    ```

## Create a purview account

1. Add the following code to the **Main** method that creates a **purview account**. If your resource group already exists, comment out the first `create_or_update` statement.

   ```python
    # create the resource group
    # comment out if the resource group already exits
    resource_client.resource_groups.create_or_update(rg_name, rg_params)

    #Create a purview
    identity = Identity(type= "SystemAssigned")
    sku = AccountSku(name= 'Standard', capacity= 4)
    purview_resource = Account(identity=identity,sku=sku,location =location )
       
    try:
	    pa = (purview_client.accounts.begin_create_or_update(rg_name, purview_name, purview_resource)).result()
	    print("location:", pa.location, " Purview Account Name: ", pa.name, " Id: " , pa.id ," tags: " , pa.tags)  
    except:
	    print("Error")
	    print_item(pa)
 
    while (getattr(pa,'provisioning_state')) != "Succeeded" :
        pa = (purview_client.accounts.get(rg_name, purview_name))  
        print(getattr(pa,'provisioning_state'))
        if getattr(pa,'provisioning_state') != "Failed" :
            print("Error in creating Purview account")
            break
        time.sleep(30)      
      ```

2. Now, add the following statement to invoke the **main** method when the program is run:

   ```python
   # Start the main method
   main()
   ```

## Full script

Here is the full Python code:

```python
	
	from azure.identity import ClientSecretCredential 
	from azure.mgmt.resource import ResourceManagementClient
	from azure.mgmt.purview import PurviewManagementClient
	from azure.mgmt.purview.models import *
	from datetime import datetime, timedelta
	import time
	
	 # Azure subscription ID
    subscription_id = '<subscription ID>'
	
	# This program creates this resource group. If it's an existing resource group, comment out the code that creates the resource group
    rg_name = '<resource group>'

    # The purview name. It must be globally unique.
    purview_name = '<purview account name>'

    # Specify your Active Directory client ID, client secret, and tenant ID
    credentials = ClientSecretCredential(client_id='<service principal ID>', client_secret='<service principal key>', tenant_id='<tenant ID>') 
    # resource_client = ResourceManagementClient(credentials, subscription_id)
    purview_client = PurviewManagementClient(credentials, subscription_id)
	
	# create the resource group
    # comment out if the resource group already exits
    resource_client.resource_groups.create_or_update(rg_name, rg_params)

    #Create a purview
    identity = Identity(type= "SystemAssigned")
    sku = AccountSku(name= 'Standard', capacity= 4)
    purview_resource = Account(identity=identity,sku=sku,location ="southcentralus" )
       
    try:
	    pa = (purview_client.accounts.begin_create_or_update(rg_name, purview_name, purview_resource)).result()
	    print("location:", pa.location, " Purview Account Name: ", purview_name, " Id: " , pa.id ," tags: " , pa.tags) 
    except:
	    print("Error in submitting job to create account")
	    print_item(pa)
 
    while (getattr(pa,'provisioning_state')) != "Succeeded" :
        pa = (purview_client.accounts.get(rg_name, purview_name))  
        print(getattr(pa,'provisioning_state'))
        if getattr(pa,'provisioning_state') != "Failed" :
            print("Error in creating Purview account")
            break
        time.sleep(30)    

# Start the main method
main()
```

## Run the code

Build and start the application, then verify the pipeline execution.

The console prints the progress of creating data factory, linked service, datasets, pipeline, and pipeline run. Wait until you see the copy activity run details with data read/written size. Then, use tools such as [Azure Storage explorer](https://azure.microsoft.com/features/storage-explorer/) to check the blob(s) is copied to "outputBlobPath" from "inputBlobPath" as you specified in variables.

Here is the sample output:

```console
location: southcentralus  Purview Account Name:  purviewpython7  Id:  /subscriptions/8c2c7b23-848d-40fe-b817-690d79ad9dfd/resourceGroups/Demo_Catalog/providers/Microsoft.Purview/accounts/purviewpython7  tags:  None
Creating
Creating
Succeeded
```

## Verify the output

Go to the **Purview accounts** page in the Azure portal and verify the account created using the above code. 

## Delete Purview Account

To delete purview account, add the following code to the program:

```python
pa = purview_client.accounts.begin_delete(rg_name, purview_name).result()
```

## Next steps

The code in this tutorial creates a purview account and  deletes a purview account. You can now download the python SDK and learn about other resource provider actions you can perform for a Purview account.

Advance to the next article to learn how to allow users to access your Azure Purview Account. 

> [!div class="nextstepaction"]
> [Add users to your Azure Purview Account](catalog-permissions.md)
