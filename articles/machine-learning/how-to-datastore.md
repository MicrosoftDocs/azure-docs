---
title: Use datastores
titleSuffix: Azure Machine Learning
description: Learn how to use datastores to connect to Azure storage services during training with Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: mldata
ms.topic: how-to
ms.author: yogipandey
author: ynpandey
ms.reviewer: franksolomon
ms.date: 02/20/2024
ms.custom: data4ml, ignite-2023, devx-track-azurecli
# Customer intent: As an experienced Python developer, I need to make my data in Azure storage available to my remote compute resource to train my machine learning models.
---

# Create datastores

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

In this article, you learn how to connect to Azure data storage services with Azure Machine Learning datastores.

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).
- The [Azure Machine Learning SDK for Python](https://aka.ms/sdk-v2-install).
- A Machine Learning workspace.

> [!NOTE]
> Machine Learning datastores do *not* create the underlying storage account resources. Instead, they link an *existing* storage account for Machine Learning use. Machine Learning datastores aren't required. If you have access to the underlying data, you can use storage URIs directly.

## Create an Azure Blob datastore

# [Python SDK: Identity-based access](#tab/sdk-identity-based-access)

```python
from azure.ai.ml.entities import AzureBlobDatastore
from azure.ai.ml import MLClient

ml_client = MLClient.from_config()

store = AzureBlobDatastore(
    name="",
    description="",
    account_name="",
    container_name=""
)

ml_client.create_or_update(store)
```

# [Python SDK: Account key](#tab/sdk-account-key)

```python
from azure.ai.ml.entities import AzureBlobDatastore
from azure.ai.ml.entities import AccountKeyConfiguration
from azure.ai.ml import MLClient

ml_client = MLClient.from_config()

store = AzureBlobDatastore(
    name="blob_protocol_example",
    description="Datastore pointing to a blob container using https protocol.",
    account_name="mytestblobstore",
    container_name="data-container",
    protocol="https",
    credentials=AccountKeyConfiguration(
        account_key="XXXxxxXXXxXXXXxxXXXXXxXXXXXxXxxXxXXXxXXXxXXxxxXXxxXXXxXxXXXxxXxxXXXXxxxxxXXxxxxxxXXXxXXX"
    ),
)

ml_client.create_or_update(store)
```

# [Python SDK: SAS](#tab/sdk-SAS)

```python
from azure.ai.ml.entities import AzureBlobDatastore
from azure.ai.ml.entities import SasTokenConfiguration
from azure.ai.ml import MLClient

ml_client = MLClient.from_config()

store = AzureBlobDatastore(
    name="blob_sas_example",
    description="Datastore pointing to a blob container using SAS token.",
    account_name="mytestblobstore",
    container_name="data-container",
    credentials=SasTokenConfiguration(
        sas_token= "?xx=XXXX-XX-XX&xx=xxxx&xxx=xxx&xx=xxxxxxxxxxx&xx=XXXX-XX-XXXXX:XX:XXX&xx=XXXX-XX-XXXXX:XX:XXX&xxx=xxxxx&xxx=XXxXXXxxxxxXXXXXXXxXxxxXXXXXxxXXXXXxXXXXxXXXxXXxXX"
    ),
)

ml_client.create_or_update(store)
```

# [CLI: Identity-based access](#tab/cli-identity-based-access)
Create the following YAML file (update the appropriate values):

```yaml
# my_blob_datastore.yml
$schema: https://azuremlschemas.azureedge.net/latest/azureBlob.schema.json
name: my_blob_ds # add your datastore name here
type: azure_blob
description: here is a description # add a datastore description here
account_name: my_account_name # add the storage account name here
container_name: my_container_name # add the storage container name here
```

Create the Machine Learning datastore in the Azure CLI:

```azurecli
az ml datastore create --file my_blob_datastore.yml
```

# [CLI: Account key](#tab/cli-account-key)
Create this YAML file (update the appropriate values):

```yaml
# my_blob_datastore.yml
$schema: https://azuremlschemas.azureedge.net/latest/azureBlob.schema.json
name: blob_example
type: azure_blob
description: Datastore pointing to a blob container.
account_name: mytestblobstore
container_name: data-container
credentials:
  account_key: XXXxxxXXXxXXXXxxXXXXXxXXXXXxXxxXxXXXxXXXxXXxxxXXxxXXXxXxXXXxxXxxXXXXxxxxxXXxxxxxxXXXxXXX
```

Create the Machine Learning datastore in the CLI:

```azurecli
az ml datastore create --file my_blob_datastore.yml
```

# [CLI: SAS](#tab/cli-sas)
Create this YAML file (update the appropriate values):

```yaml
# my_blob_datastore.yml
$schema: https://azuremlschemas.azureedge.net/latest/azureBlob.schema.json
name: blob_sas_example
type: azure_blob
description: Datastore pointing to a blob container using SAS token.
account_name: mytestblobstore
container_name: data-container
credentials:
  sas_token: ?xx=XXXX-XX-XX&xx=xxxx&xxx=xxx&xx=xxxxxxxxxxx&xx=XXXX-XX-XXXXX:XX:XXX&xx=XXXX-XX-XXXXX:XX:XXX&xxx=xxxxx&xxx=XXxXXXxxxxxXXXXXXXxXxxxXXXXXxxXXXXXxXXXXxXXXxXXxXX
```

Create the Machine Learning datastore in the CLI:

```azurecli
az ml datastore create --file my_blob_datastore.yml
```
---

## Create an Azure Data Lake Storage Gen2 datastore

# [Python SDK: Identity-based access](#tab/sdk-adls-identity-access)

```python
from azure.ai.ml.entities import AzureDataLakeGen2Datastore
from azure.ai.ml import MLClient

ml_client = MLClient.from_config()

store = AzureDataLakeGen2Datastore(
    name="",
    description="",
    account_name="",
    filesystem=""
)

ml_client.create_or_update(store)
```

# [Python SDK: Service principal](#tab/sdk-adls-sp)

```python
from azure.ai.ml.entities import AzureDataLakeGen2Datastore
from azure.ai.ml.entities._datastore.credentials import ServicePrincipalCredentials

from azure.ai.ml import MLClient

ml_client = MLClient.from_config()

store = AzureDataLakeGen2Datastore(
    name="adls_gen2_example",
    description="Datastore pointing to an Azure Data Lake Storage Gen2.",
    account_name="mytestdatalakegen2",
    filesystem="my-gen2-container",
     credentials=ServicePrincipalCredentials(
        tenant_id= "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
        client_id= "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
        client_secret= "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    ),
)

ml_client.create_or_update(store)
```

# [CLI: Identity-based access](#tab/cli-adls-identity-based-access)
Create this YAML file (update the values):

```yaml
# my_adls_datastore.yml
$schema: https://azuremlschemas.azureedge.net/latest/azureDataLakeGen2.schema.json
name: adls_gen2_credless_example
type: azure_data_lake_gen2
description: Credential-less datastore pointing to an Azure Data Lake Storage Gen2 instance.
account_name: mytestdatalakegen2
filesystem: my-gen2-container
```

Create the Machine Learning datastore in the CLI:

```azurecli
az ml datastore create --file my_adls_datastore.yml
```

# [CLI: Service principal](#tab/cli-adls-sp)
Create this YAML file (update the values):

```yaml
# my_adls_datastore.yml
$schema: https://azuremlschemas.azureedge.net/latest/azureDataLakeGen2.schema.json
name: adls_gen2_example
type: azure_data_lake_gen2
description: Datastore pointing to an Azure Data Lake Storage Gen2 instance.
account_name: mytestdatalakegen2
filesystem: my-gen2-container
credentials:
  tenant_id: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
  client_id: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
  client_secret: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

Create the Machine Learning datastore in the CLI:

```azurecli
az ml datastore create --file my_adls_datastore.yml
```
---

## Create an Azure Files datastore

# [Python SDK: Account key](#tab/sdk-azfiles-accountkey)

```python
from azure.ai.ml.entities import AzureFileDatastore
from azure.ai.ml.entities import AccountKeyConfiguration
from azure.ai.ml import MLClient

ml_client = MLClient.from_config()

store = AzureFileDatastore(
    name="file_example",
    description="Datastore pointing to an Azure File Share.",
    account_name="mytestfilestore",
    file_share_name="my-share",
    credentials=AccountKeyConfiguration(
        account_key= "XXXxxxXXXxXXXXxxXXXXXxXXXXXxXxxXxXXXxXXXxXXxxxXXxxXXXxXxXXXxxXxxXXXXxxxxxXXxxxxxxXXXxXXX"
    ),
)

ml_client.create_or_update(store)
```

# [Python SDK: SAS](#tab/sdk-azfiles-sas)

```python
from azure.ai.ml.entities import AzureFileDatastore
from azure.ai.ml.entities import SasTokenConfiguration
from azure.ai.ml import MLClient

ml_client = MLClient.from_config()

store = AzureFileDatastore(
    name="file_sas_example",
    description="Datastore pointing to an Azure File Share using SAS token.",
    account_name="mytestfilestore",
    file_share_name="my-share",
    credentials=SasTokenConfiguration(
        sas_token="?xx=XXXX-XX-XX&xx=xxxx&xxx=xxx&xx=xxxxxxxxxxx&xx=XXXX-XX-XXXXX:XX:XXX&xx=XXXX-XX-XXXXX:XX:XXX&xxx=xxxxx&xxx=XXxXXXxxxxxXXXXXXXxXxxxXXXXXxxXXXXXxXXXXxXXXxXXxXX"
    ),
)

ml_client.create_or_update(store)
```

# [CLI: Account key](#tab/cli-azfiles-account-key)
Create this YAML file (update the values):

```yaml
# my_files_datastore.yml
$schema: https://azuremlschemas.azureedge.net/latest/azureFile.schema.json
name: file_example
type: azure_file
description: Datastore pointing to an Azure File Share.
account_name: mytestfilestore
file_share_name: my-share
credentials:
  account_key: XxXxXxXXXXXXXxXxXxxXxxXXXXXXXXxXxxXXxXXXXXXXxxxXxXXxXXXXXxXXxXXXxXxXxxxXXxXXxXXXXXxXxxXX
```

Create the Machine Learning datastore in the CLI:

```azurecli
az ml datastore create --file my_files_datastore.yml
```

# [CLI: SAS](#tab/cli-azfiles-sas)
Create this YAML file (update the values):

```yaml
# my_files_datastore.yml
$schema: https://azuremlschemas.azureedge.net/latest/azureFile.schema.json
name: file_sas_example
type: azure_file
description: Datastore pointing to an Azure File Share using an SAS token.
account_name: mytestfilestore
file_share_name: my-share
credentials:
  sas_token: ?xx=XXXX-XX-XX&xx=xxxx&xxx=xxx&xx=xxxxxxxxxxx&xx=XXXX-XX-XXXXX:XX:XXX&xx=XXXX-XX-XXXXX:XX:XXX&xxx=xxxxx&xxx=XXxXXXxxxxxXXXXXXXxXxxxXXXXXxxXXXXXxXXXXxXXXxXXxXX
```

Create the Machine Learning datastore in the CLI:

```azurecli
az ml datastore create --file my_files_datastore.yml
```
---

## Create an Azure Data Lake Storage Gen1 datastore

# [Python SDK: Identity-based access](#tab/sdk-adlsgen1-identity-access)

```python
from azure.ai.ml.entities import AzureDataLakeGen1Datastore
from azure.ai.ml import MLClient

ml_client = MLClient.from_config()

store = AzureDataLakeGen1Datastore(
    name="",
    store_name="",
    description="",
)

ml_client.create_or_update(store)
```

# [Python SDK: Service principal](#tab/sdk-adlsgen1-sp)

```python
from azure.ai.ml.entities import AzureDataLakeGen1Datastore
from azure.ai.ml.entities._datastore.credentials import ServicePrincipalCredentials
from azure.ai.ml import MLClient

ml_client = MLClient.from_config()

store = AzureDataLakeGen1Datastore(
    name="adls_gen1_example",
    description="Datastore pointing to an Azure Data Lake Storage Gen1.",
    store_name="mytestdatalakegen1",
    credentials=ServicePrincipalCredentials(
        tenant_id= "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
        client_id= "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
        client_secret= "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    ),
)

ml_client.create_or_update(store)
```

# [CLI: Identity-based access](#tab/cli-adlsgen1-identity-based-access)
Create this YAML file (update the values):

```yaml
# my_adls_datastore.yml
$schema: https://azuremlschemas.azureedge.net/latest/azureDataLakeGen1.schema.json
name: alds_gen1_credless_example
type: azure_data_lake_gen1
description: Credential-less datastore pointing to an Azure Data Lake Storage Gen1 instance.
store_name: mytestdatalakegen1
```

Create the Machine Learning datastore in the CLI:

```azurecli
az ml datastore create --file my_adls_datastore.yml
```

# [CLI: Service principal](#tab/cli-adlsgen1-sp)
Create this YAML file (update the values):

```yaml
# my_adls_datastore.yml
$schema: https://azuremlschemas.azureedge.net/latest/azureDataLakeGen1.schema.json
name: adls_gen1_example
type: azure_data_lake_gen1
description: Datastore pointing to an Azure Data Lake Storage Gen1 instance.
store_name: mytestdatalakegen1
credentials:
  tenant_id: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
  client_id: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
  client_secret: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

Create the Machine Learning datastore in the CLI:

```azurecli
az ml datastore create --file my_adls_datastore.yml
```
---

---

## Create a OneLake (Microsoft Fabric) datastore (preview)

This section describes various options to create a OneLake datastore. The OneLake datastore is part of Microsoft Fabric. At this time, Machine Learning supports connection to Microsoft Fabric lakehouse artifacts that include folders or files and Amazon S3 shortcuts. For more information about lakehouses, see [What is a lakehouse in Microsoft Fabric?](/fabric/data-engineering/lakehouse-overview).

OneLake datastore creation requires the following information from your Microsoft Fabric instance:

- Endpoint
- Fabric workspace name or GUID
- Artifact name or GUID

 The following three screenshots describe the retrieval of these required information resources from your Microsoft Fabric instance.

### OneLake workspace name
In your Microsoft Fabric instance, you can find the workspace information, as shown in this screenshot. You can use either a GUID value or a "friendly name" to create a Machine Learning OneLake datastore.

:::image type="content" source="media/how-to-datastore/fabric-workspace.png" alt-text="Screenshot that shows Microsoft Fabric workspace details in the Microsoft Fabric UI." lightbox="./media/how-to-datastore/fabric-workspace.png":::

### OneLake endpoint
This screenshot shows how you can find endpoint information in your Microsoft Fabric instance.

:::image type="content" source="media/how-to-datastore/fabric-endpoint.png" alt-text="Screenshot that shows Microsoft Fabric endpoint details in the Microsoft Fabric UI." lightbox="./media/how-to-datastore/fabric-endpoint.png":::

### OneLake artifact name
This screenshot shows how you can find the artifact information in your Microsoft Fabric instance. The screenshot also shows how you can use either a GUID value or a friendly name to create a Machine Learning OneLake datastore.

:::image type="content" source="media/how-to-datastore/fabric-lakehouse.png" alt-text="Screenshot that shows how to get Microsoft Fabric lakehouse artifact details in the Microsoft Fabric UI." lightbox="./media/how-to-datastore/fabric-lakehouse.png":::

## Create a OneLake datastore

# [Python SDK: Identity-based access](#tab/sdk-onelake-identity-access)

```python
from azure.ai.ml.entities import OneLakeDatastore, OneLakeArtifact
from azure.ai.ml import MLClient

ml_client = MLClient.from_config()

store = OneLakeDatastore(
    name="onelake_example_id",
    description="Datastore pointing to an Microsoft fabric artifact.",
    one_lake_workspace_name="AzureML_Sample_OneLakeWS",
    endpoint="msit-onelake.dfs.fabric.microsoft.com"
    artifact = OneLakeArtifact(
        name="AzML_Sample_LH",
        type="lake_house"
    )
)

ml_client.create_or_update(store)
```

# [Python SDK: Service principal](#tab/sdk-onelake-sp)

```python
from azure.ai.ml.entities import AzureDataLakeGen1Datastore
from azure.ai.ml.entities._datastore.credentials import ServicePrincipalCredentials
from azure.ai.ml import MLClient

ml_client = MLClient.from_config()

rom azure.ai.ml.entities import OneLakeDatastore, OneLakeArtifact
from azure.ai.ml import MLClient

ml_client = MLClient.from_config()

store = OneLakeDatastore(
    name="onelake_example_sp",
    description="Datastore pointing to an Microsoft fabric artifact.",
    one_lake_workspace_name="AzureML_Sample_OneLakeWS",
    endpoint="msit-onelake.dfs.fabric.microsoft.com"
    artifact = OneLakeArtifact(
    name="AzML_Sample_LH",
    type="lake_house"
    )
    credentials=ServicePrincipalCredentials(
        tenant_id= "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
        client_id= "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
        client_secret= "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    ),
)

ml_client.create_or_update(store)
```

# [CLI: Identity-based access](#tab/cli-onelake-identity-based-access)
Create the following YAML file (update the values):

```yaml
# my_onelake_datastore.yml
$schema: http://azureml/sdk-2-0/OneLakeDatastore.json
name: onelake_example_id
type: one_lake
description: Credential-less datastore pointing to a OneLake lakehouse.
one_lake_workspace_name: "AzureML_Sample_OneLakeWS"
endpoint: "msit-onelake.dfs.fabric.microsoft.com"
artifact:
  type: lake_house
  name: "AzML_Sample_LH"
```

Create the Machine Learning datastore in the CLI:

```azurecli
az ml datastore create --file my_onelake_datastore.yml
```

# [CLI: Service principal](#tab/cli-onelake-sp)
Create the following YAML file (update the values):

```yaml
# my_onelakesp_datastore.yml
$schema: http://azureml/sdk-2-0/OneLakeDatastore.json
name: onelake_example_id
type: one_lake
description: Credential-less datastore pointing to a OneLake lakehouse.
one_lake_workspace_name: "AzureML_Sample_OneLakeWS"
endpoint: "msit-onelake.dfs.fabric.microsoft.com"
artifact:
  type: lake_house
  name: "AzML_Sample_LH"
credentials:
  tenant_id: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
  client_id: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
  client_secret: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

Create the Machine Learning datastore in the CLI:

```azurecli
az ml datastore create --file my_onelakesp_datastore.yml
```
---

## Next steps

- [Access data in a job](how-to-read-write-data-v2.md#access-data-in-a-job)
- [Create and manage data assets](how-to-create-data-assets.md#create-and-manage-data-assets)
- [Import data assets (preview)](how-to-import-data-assets.md#import-data-assets-preview)
- [Data administration](how-to-administrate-data-authentication.md#data-administration)