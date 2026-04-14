---
title: Prepare Azure Files data for document-based RAG applications with open-source frameworks
description: Learn how to authenticate to an Azure file share and download files for ingestion into a document-based RAG application using open-source frameworks.
author: ftrichardson1
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 04/08/2026
ms.author: t-flynnr
ms.custom: devx-track-python
---

# Prepare Azure Files data for document‑based RAG applications using open‑source AI tooling

This article describes how to authenticate to an Azure file share and download its contents for use with open‑source retrieval‑augmented generation (RAG) tooling.

## Prerequisites

- An [Azure file share](/azure/storage/files/create-classic-file-share?tabs=azure-portal) containing the documents you want to query. If you don't have an Azure subscription, [create one for free](https://azure.microsoft.com/free/).
- [Python 3.12.10](https://www.python.org/downloads/release/python-31210/). On Windows, install the **x64** version.
- [Azure CLI](/cli/azure/install-azure-cli).

## Grant access to an Azure file share

This article uses Microsoft Entra ID authentication via [`DefaultAzureCredential`](/azure/developer/python/sdk/authentication/credential-chains?tabs=dac#defaultazurecredential-overview), the recommended credential pattern for Azure software development kits (SDKs). This approach avoids storage account keys and provides a portable authentication mechanism that works across development and production environments.

> [!TIP]
> Receiving a `403 Forbidden` error typically indicates missing authorization rather than failed authentication.

Assign the [**Storage File Data Privileged Reader**](/azure/storage/files/authorize-oauth-rest?tabs=portal#privileged-access-and-access-permissions-for-data-operations) role on the storage account hosting the file share.

> [!NOTE]
> This role is required because the code accesses Azure Files using [`token_intent="backup"`](/python/api/azure-storage-file-share/azure.storage.fileshare.shareclient#keyword-only-parameters). This access pattern bypasses file‑level permissions, so Azure requires a privileged role. The **Storage File Data Privileged Reader** role is sufficient because the code performs only read operations and doesn't modify file contents.

#### Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your storage account.
2. Select **Access Control (IAM)** > **Add** > **Add role assignment**.
3. Search for **Storage File Data Privileged Reader**, select it, and select **Next**.
4. Select **Select members**, search for your user account, and select it.
5. Select **Review + assign**.

#### Azure CLI

```bash
az login

az role assignment create \
  --assignee $(az ad signed-in-user show --query id -o tsv) \
  --role "Storage File Data Privileged Reader" \
  --scope $(az storage account show \
	--name <your-storage-account-name> \
	--query id -o tsv)
```

#### Azure PowerShell

```powershell
Connect-AzAccount

New-AzRoleAssignment `
	-SignInName (Get-AzADUser -SignedIn).UserPrincipalName `
	-RoleDefinitionName "Storage File Data Privileged Reader" `
	-Scope (Get-AzStorageAccount `
		-ResourceGroupName <your-resource-group> `
		-Name <your-storage-account-name>).Id
```

## Set environment variables

Create a `.env` file in your project directory with your Azure Files connection details:

```text
AZURE_STORAGE_ACCOUNT_NAME=<your-storage-account-name>
AZURE_STORAGE_SHARE_NAME=<your-share-name>
```

| Variable | Description |
| :--- | :--- |
| `AZURE_STORAGE_ACCOUNT_NAME` | The name of your Azure Storage account |
| `AZURE_STORAGE_SHARE_NAME` | The name of your Azure file share |

## Download files from an Azure file share

1. Install the required packages:

   - `azure-identity`—provides `DefaultAzureCredential` for passwordless authentication.
   - `azure-storage-file-share`—provides the [`ShareClient`](/python/api/azure-storage-file-share/azure.storage.fileshare.shareclient) used to connect to and download files from the share.

   ```bash
   pip install azure-identity
   pip install azure-storage-file-share
   ```

2. Connect to an Azure file share, recursively enumerate its directory structure, and collect the details required to locate and download each file. The `ShareClient` requires `token_intent="backup"` when using Microsoft Entra ID–based authentication.

   ```python
   import os
   import posixpath
   import tempfile

   from azure.identity import DefaultAzureCredential
   from azure.storage.fileshare import ShareClient

   account_name = os.environ["AZURE_STORAGE_ACCOUNT_NAME"]
   share_name = os.environ["AZURE_STORAGE_SHARE_NAME"]

   share = ShareClient(
	   account_url=f"https://{account_name}.file.core.windows.net",
	   share_name=share_name,
	   credential=DefaultAzureCredential(),
	   token_intent="backup",
   )

   root = share.get_directory_client("")
   file_references = []
   directories_to_traverse = [root]

   while directories_to_traverse:
	   current = directories_to_traverse.pop()
	   for item in current.list_directories_and_files():
		   if item.is_directory:
			   directories_to_traverse.append(current.get_subdirectory_client(item.name))
		   else:
			   # Azure Files paths use posix-style separators.
			   relative_path = posixpath.join(current.directory_path or "", item.name)
			   file_references.append((item.name, relative_path, current))
   ```

3. Download the files. Before writing files to disk, the code validates each resolved file path to ensure it remains within the destination directory. This validation prevents files from being written outside the intended location when processing directory structures from an external source.

   ```python
   with tempfile.TemporaryDirectory() as destination:
	   for name, relative_path, parent_directory in file_references:
		   file_client = parent_directory.get_file_client(name)
		   local_path = os.path.join(destination, relative_path)

		   # Path traversal guard
		   real_dest = os.path.realpath(destination) + os.sep
		   if not os.path.realpath(local_path).startswith(real_dest):
			   raise ValueError(f"Path traversal detected: {relative_path}")

		   os.makedirs(os.path.dirname(local_path), exist_ok=True)
		   with open(local_path, "wb") as f:
			   for chunk in file_client.download_file().chunks():
				   f.write(chunk)
   ```

## Next steps

Choose a tutorial to continue with parsing, chunking, embedding, and querying:

- [LangChain](orchestrations/langchain.md)—LangChain + Pinecone, Weaviate, Qdrant
- [LlamaIndex](orchestrations/llamaindex.md)—LlamaIndex + Pinecone, Weaviate, Qdrant
- [Haystack](orchestrations/haystack.md)—Haystack + Pinecone, Weaviate, Qdrant

