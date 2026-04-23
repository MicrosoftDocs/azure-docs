---
title: Prepare Azure Files data for document-based RAG applications with open-source frameworks
description: Learn how to authenticate to an Azure file share and download files for ingestion into a document-based RAG application using open-source frameworks.
author: ftrichardson1
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 04/19/2026
ms.author: t-flynnr
ms.devlang: python
ms.custom: devx-track-python
---

# Prepare Azure Files data for document-based RAG applications with open-source frameworks

**Applies to:** ✔️ SMB file shares with Microsoft Entra ID authentication

This article shows you how to create a project directory, authenticate to an Azure file share, and build the download logic that each open-source RAG tutorial in this section depends on.

When you're finished, your project directory should look like this and be ready for any of the open-source RAG tutorials:

```
<project-directory>/
├── .venv/
├── .env
├── azure_files.py
└── requirements.txt
```

> [!NOTE]
> This article uses Azure file shares accessed over Server Message Block (SMB), authenticated with a Microsoft Entra identity via `DefaultAzureCredential`. Network File System (NFS) file shares don't support Microsoft Entra ID authentication and have their own setup requirements. To use an NFS share, [create and mount it](/azure/storage/files/storage-files-how-to-mount-nfs-shares) per the Azure Files NFS guidance, then adapt `azure_files.py` to read from your mount point using standard file system operations, keeping the same function signatures.

## Prerequisites

- An [Azure file share](/azure/storage/files/create-classic-file-share?tabs=azure-portal) containing the documents you want to query. If you don't have an Azure subscription, [create one for free](https://azure.microsoft.com/free/).
- [Python 3.10–3.12](https://www.python.org/downloads/), with `pip` available. On Windows, install the **x64** build (not ARM64).
- [Azure CLI](/cli/azure/install-azure-cli) or [Azure PowerShell](/powershell/azure/install-azure-powershell). Either works on any OS.
- An [Azure OpenAI](/azure/ai-services/openai/how-to/create-resource) resource with the following model deployments:
  - A text embedding model (for example, `text-embedding-3-small`)
  - A chat completion model (for example, `gpt-4o-mini`)

  > [!NOTE]
  > If you create the resource through Azure AI Foundry, you might be prompted to choose between a hub-based project and a Foundry project. Either type works for these tutorials—pick whichever fits your environment. The tutorials only need the resource endpoint and the two model deployment names, which you can find on the Keys and Endpoint and Deployments pages of your Azure OpenAI resource.
- A code editor such as [Visual Studio Code](https://code.visualstudio.com/). The tutorials use plain text files (`.env`, `.py`, `requirements.txt`), so any editor works, but VS Code is recommended for its built-in Python and terminal support.

## Set up your project

Open a terminal and create a project directory:

```bash
mkdir <project-directory>
cd <project-directory>
```

> [!TIP]
> If you plan to commit this project to source control, add `.env` and `.venv/` to your `.gitignore` file so you don't accidentally publish secrets or the virtual environment.

### Create a Python virtual environment

Create and activate a virtual environment to isolate the tutorial dependencies from your system Python.

# [Windows](#tab/windows)

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

> [!TIP]
> If you see an error like `running scripts is disabled on this system` when activating the virtual environment, PowerShell is blocking script execution by default. Run the following command, enter `Y` when prompted, and then retry the activation command:
>
> ```powershell
> Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
> ```
>
> This change only applies to the current PowerShell session.

> [!NOTE]
> On Windows, verify you installed the **x64** version of Python (listed in [Prerequisites](#prerequisites)) by running:
>
> ```powershell
> python -c "import struct; print(struct.calcsize('P') * 8)"
> ```
>
> The output should be `64`.

# [macOS/Linux](#tab/macos-linux)

```bash
python3 -m venv .venv
source .venv/bin/activate
```

---

## Grant access to your Azure resources

The tutorials use Microsoft Entra ID authentication via [`DefaultAzureCredential`](/azure/developer/python/sdk/authentication/credential-chains?tabs=dac#defaultazurecredential-overview), so you don't need account keys or API keys. You need to assign two roles to your user account:

| Resource | Role | Why |
| :--- | :--- | :--- |
| Storage account (hosts the file share) | [**Storage File Data Privileged Reader**](/azure/storage/files/authorize-oauth-rest?tabs=portal#privileged-access-and-access-permissions-for-data-operations) | Read files from the share using OAuth |
| Azure OpenAI resource | [**Cognitive Services OpenAI User**](/azure/ai-services/openai/how-to/role-based-access-control) | Call embedding and chat completion deployments |

> [!IMPORTANT]
> To assign roles, your account must have the **Owner**, **User Access Administrator**, or **Role Based Access Control Administrator** role on the target resource (or its resource group or subscription). If you don't have one of these roles, contact your Azure subscription administrator and skip ahead to [Set environment variables](#set-environment-variables) after they assign the two roles.

### Assign the roles

# [Azure portal](#tab/azure-portal)

#### Storage account

1. In the [Azure portal](https://portal.azure.com), navigate to your storage account.

   :::image type="content" source="../../media/retrieval-augmented-generation/role-assignment-storage-home.png" alt-text="Screenshot of the Azure portal home page with a storage account highlighted under Recent resources.":::

1. Select **Access control (IAM)** from the left navigation.

   :::image type="content" source="../../media/retrieval-augmented-generation/role-assignment-storage-access-control.png" alt-text="Screenshot of a storage account overview page in the Azure portal with Access control (IAM) highlighted in the left navigation.":::

1. Select **Add role assignment**.

   :::image type="content" source="../../media/retrieval-augmented-generation/role-assignment-add-role.png" alt-text="Screenshot of the Access control (IAM) page in the Azure portal with the Add role assignment button highlighted.":::

1. Search for **Storage File Data Privileged Reader**, select it, and select **Next**.

   :::image type="content" source="../../media/retrieval-augmented-generation/role-assignment-storage-role.png" alt-text="Screenshot of the Add role assignment page with the Storage File Data Privileged Reader role selected.":::

1. On the **Members** tab, leave **User, group, or service principal** selected and select **+ Select members**.

   :::image type="content" source="../../media/retrieval-augmented-generation/role-assignment-members-tab.png" alt-text="Screenshot of the Members tab on the Add role assignment page with User, group, or service principal selected and the Select members link highlighted.":::

1. In the **Select members** pane, type your name or work email in the search box, select your account from the results, and then select **Select**.

   :::image type="content" source="../../media/retrieval-augmented-generation/role-assignment-select-members.png" alt-text="Screenshot of the Select members pane with a user account in the search results and the Select button highlighted.":::

1. Select **Review + assign**.

   :::image type="content" source="../../media/retrieval-augmented-generation/role-assignment-members-filled.png" alt-text="Screenshot of the Members tab with the selected user listed in the members table and the Review + assign button highlighted.":::

#### Azure OpenAI resource

Repeat the steps for your Azure OpenAI resource, searching for **Cognitive Services OpenAI User** instead.

1. In the [Azure portal](https://portal.azure.com), navigate to your Azure OpenAI resource.

   :::image type="content" source="../../media/retrieval-augmented-generation/role-assignment-openai-home.png" alt-text="Screenshot of the Azure portal home page with an Azure OpenAI resource highlighted under Recent resources.":::

1. Select **Access control (IAM)** from the left navigation, then select **Add role assignment**.

   :::image type="content" source="../../media/retrieval-augmented-generation/role-assignment-openai-access-control.png" alt-text="Screenshot of an Azure OpenAI resource overview page with Access control (IAM) highlighted in the left navigation.":::

1. Search for **Cognitive Services OpenAI User**, select it, and select **Next**.

   :::image type="content" source="../../media/retrieval-augmented-generation/role-assignment-openai-role.png" alt-text="Screenshot of the Add role assignment page with the Cognitive Services OpenAI User role selected.":::

1. On the **Members** tab, select **+ Select members**, type your name or work email, select your account, and then select **Select**.
1. Select **Review + assign**.

# [Azure CLI](#tab/azure-cli)

```azurecli
az login

# Storage account
az role assignment create --assignee $(az ad signed-in-user show --query id -o tsv) --role "Storage File Data Privileged Reader" --scope $(az storage account show --name <your-storage-account-name> --query id -o tsv)

# Azure OpenAI
az role assignment create --assignee $(az ad signed-in-user show --query id -o tsv) --role "Cognitive Services OpenAI User" --scope $(az cognitiveservices account show --name <your-openai-resource-name> --resource-group <your-resource-group> --query id -o tsv)
```

Replace `<your-storage-account-name>`, `<your-openai-resource-name>`, and `<your-resource-group>` with your values.

# [Azure PowerShell](#tab/azure-powershell)

```powershell
Connect-AzAccount

# Storage account
New-AzRoleAssignment `
    -SignInName (Get-AzADUser -SignedIn).UserPrincipalName `
    -RoleDefinitionName "Storage File Data Privileged Reader" `
    -Scope (Get-AzStorageAccount -ResourceGroupName <your-resource-group> -Name <your-storage-account-name>).Id

# Azure OpenAI
New-AzRoleAssignment `
    -SignInName (Get-AzADUser -SignedIn).UserPrincipalName `
    -RoleDefinitionName "Cognitive Services OpenAI User" `
    -Scope (Get-AzCognitiveServicesAccount -ResourceGroupName <your-resource-group> -Name <your-openai-resource-name>).Id
```

Replace `<your-resource-group>`, `<your-storage-account-name>`, and `<your-openai-resource-name>` with your values.

---

> [!NOTE]
> Role assignments can take 1–2 minutes to propagate. If the smoke test later in this article fails with `403 Forbidden` immediately after you assign the roles, wait a minute and retry before troubleshooting further.

> [!TIP]
> **If you see auth errors** when assigning roles or running Azure commands:
>
> - `403 Forbidden` usually means the role assignment is missing or not propagated yet. Wait 1–2 minutes after assignment and retry.
> - `401 PermissionDenied` usually means the token is missing, expired, or couldn't be acquired. Rerun `az login` (or `Connect-AzAccount`) and retry.
> - If you have multiple subscriptions, confirm you're in the right one (`az account show` / `Get-AzContext`) and switch if needed (`az account set --subscription <id>` / `Set-AzContext -Subscription <id>`).

## Set environment variables

Create a `.env` file in your project directory (for example, run `code .env` to create and open it in VS Code) and populate it with your Azure Files and Azure OpenAI connection details:

```text
AZURE_STORAGE_ACCOUNT_NAME=<your-storage-account-name>
AZURE_STORAGE_SHARE_NAME=<your-share-name>
AZURE_OPENAI_ENDPOINT=https://<your-openai-resource-name>.openai.azure.com
AZURE_OPENAI_EMBEDDING_DEPLOYMENT=<your-embedding-deployment-name>
AZURE_OPENAI_CHAT_DEPLOYMENT=<your-chat-deployment-name>
```

| Variable | Description |
| :--- | :--- |
| `AZURE_STORAGE_ACCOUNT_NAME` | The name of your Azure Storage account |
| `AZURE_STORAGE_SHARE_NAME` | The name of your Azure file share |
| `AZURE_OPENAI_ENDPOINT` | Your Azure OpenAI resource endpoint URL. Find it on the **Keys and Endpoint** page of your Azure OpenAI resource in the Azure portal. For details, see [Retrieve resource information](/azure/ai-services/openai/how-to/create-resource#retrieve-resource-information). |
| `AZURE_OPENAI_EMBEDDING_DEPLOYMENT` | The name of your text embedding model deployment (for example, `text-embedding-3-small`) |
| `AZURE_OPENAI_CHAT_DEPLOYMENT` | The name of your chat completion model deployment (for example, `gpt-4o-mini`) |


Each tutorial adds vector-database-specific variables (such as API keys and index names) to this `.env` file. If you follow more than one tutorial, each project directory needs its own `.env` file.

## Install base packages

Create a `requirements.txt` file (for example, run `code requirements.txt`) and fill it with the base dependencies shared by all tutorials:

```text
azure-identity
azure-storage-file-share
python-dotenv
```

- `azure-identity`—provides `DefaultAzureCredential` for keyless authentication.
- `azure-storage-file-share`—provides the [`ShareClient`](/python/api/azure-storage-file-share/azure.storage.fileshare.shareclient) used to connect to and download files from the share.
- `python-dotenv`—loads environment variables from the `.env` file (each tutorial calls `load_dotenv()` from its main script).

With your virtual environment activated, install them:

```bash
pip install -r requirements.txt
```

> [!NOTE]
> Each tutorial adds framework-specific packages to this file. If you follow more than one tutorial, create a separate project directory and virtual environment for each to avoid dependency conflicts.

## Build `azure_files.py`

Create a file called `azure_files.py` in your project directory (for example, run `code azure_files.py`). This module contains three helper functions that each tutorial imports and calls from its `main()` function. The steps below walk through each function so you understand what it does before you run it.

Start the file with the imports used across all three functions:

```python
import os
import posixpath

from azure.identity import DefaultAzureCredential
from azure.storage.fileshare import ShareClient
```

| Import | Why it's necessary |
| :--- | :--- |
| `os` | File system operations: building local paths, creating directories, path traversal validation |
| `posixpath` | Azure Files uses forward-slash (`/`) paths regardless of OS; `posixpath.join` ensures correct path separators |
| `DefaultAzureCredential` | Authenticates to Azure using the first available credential (CLI sign-in, managed identity, etc.) without API keys |
| `ShareClient` | SDK client for connecting to an Azure file share, listing directories, and downloading files |

### Step 1: Connect to the file share

Create a `ShareClient` that the other two functions use to access the share.

```python
def connect_to_share(account_name, share_name, credential):
    return ShareClient(
        account_url=f"https://{account_name}.file.core.windows.net",
        share_name=share_name,
        credential=credential,
        token_intent="backup",
    )
```

The `token_intent="backup"` parameter is required for OAuth (Microsoft Entra ID) access to Azure file shares. Each tutorial passes a `DefaultAzureCredential` instance for the `credential` argument.

### Step 2: List files in the share

Recursively walk the share's directory structure and collect the metadata required to locate and download each file.

```python
def list_share_files(share, start_directory_path=""):
    root = share.get_directory_client(start_directory_path)
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

    return file_references
```

The function returns a list of `(file_name, relative_path, parent_directory_client)` tuples. The `start_directory_path` parameter lets callers limit traversal to a subfolder; the default (`""`) walks the entire share.

Azure Files paths use forward-slash separators regardless of the client OS, so the function uses `posixpath.join` instead of `os.path.join` when building the relative path.

### Step 3: Download files locally

Download each file referenced by `list_share_files` to a local directory and return metadata about the saved files.

```python
def download_files(file_references, destination):
    os.makedirs(destination, exist_ok=True)
    downloaded_files = []

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

        downloaded_files.append({
            "local_path": local_path,
            "file_name": name,
            "relative_path": relative_path,
        })

    return downloaded_files
```

Before it writes any file, the function validates the resolved path to ensure it stays inside `destination`. This path-traversal guard prevents a malicious or malformed share path—for example, one containing `..`—from writing files outside the destination. The upfront `os.makedirs(destination, exist_ok=True)` call guarantees the destination exists before any traversal check runs.

Each file is streamed in chunks (`file_client.download_file().chunks()`) rather than loaded fully into memory, so large files download safely.

`os.path.join` uses the OS-native separator, so `local_path` contains backslashes on Windows and forward slashes on macOS and Linux—even though `relative_path` always uses forward slashes. Downstream tutorials consume `local_path` through open-source loaders that handle either separator, so no extra conversion is needed.

### Step 4: Verify the setup

To confirm your role assignment is active and `azure_files.py` works end-to-end, append the following smoke test to the bottom of `azure_files.py`:

```python
if __name__ == "__main__":
    from dotenv import load_dotenv

    load_dotenv()

    account = os.environ["AZURE_STORAGE_ACCOUNT_NAME"]
    share_name = os.environ["AZURE_STORAGE_SHARE_NAME"]

    share = connect_to_share(account, share_name, DefaultAzureCredential())
    files = list_share_files(share)
    print(f"Found {len(files)} file(s) in share '{share_name}':")
    for name, relative_path, _ in files[:10]:
        print(f"  {relative_path}")
```

Save the file, then run it from your project directory (with the virtual environment activated):

```bash
python azure_files.py
```

Expected output:

```output
Found <N> file(s) in share '<your-share-name>':
  <relative/path/to/file-1>
  <relative/path/to/file-2>
  ...
```

If you see a `403 Forbidden` error, see the troubleshooting tip in [Grant access to your Azure resources](#grant-access-to-your-azure-resources).

If the output shows `Found 0 file(s)`, the share is empty. Upload at least one document to the share before continuing—otherwise the downstream tutorials will index nothing and the Q&A session will have no content to ground its answers in.

> [!NOTE]
> Remove the smoke test block before following a tutorial—each tutorial replaces it with its own `main()` function.

## Questions

Have questions about this tutorial? Email us at [AzureFilesPM@microsoft.com](mailto:AzureFilesPM@microsoft.com).

## Next steps

Your project directory now matches the structure shown at the top of this article. Choose a tutorial to continue with parsing, chunking, embedding, and querying:

|                | **Pinecone** | **Weaviate** | **Qdrant** |
| :------------- | :----------- | :----------- | :--------- |
| **LangChain**  | [Tutorial](tutorials/langchain-pinecone/tutorial-langchain-pinecone.md)  | [Tutorial](tutorials/langchain-weaviate/tutorial-langchain-weaviate.md)  | [Tutorial](tutorials/langchain-qdrant/tutorial-langchain-qdrant.md)  |
| **LlamaIndex** | [Tutorial](tutorials/llamaindex-pinecone/tutorial-llamaindex-pinecone.md) | [Tutorial](tutorials/llamaindex-weaviate/tutorial-llamaindex-weaviate.md) | [Tutorial](tutorials/llamaindex-qdrant/tutorial-llamaindex-qdrant.md) |
| **Haystack**   | [Tutorial](tutorials/haystack-pinecone/tutorial-haystack-pinecone.md)   | [Tutorial](tutorials/haystack-weaviate/tutorial-haystack-weaviate.md)   | [Tutorial](tutorials/haystack-qdrant/tutorial-haystack-qdrant.md)   |

To learn more about each open-source AI tool used in these tutorials, see:

- [LangChain](orchestrations/langchain.md)
- [LlamaIndex](orchestrations/llamaindex.md)
- [Haystack](orchestrations/haystack.md)
- [Pinecone](vector-databases/pinecone.md)
- [Weaviate](vector-databases/weaviate.md)
- [Qdrant](vector-databases/qdrant.md)

