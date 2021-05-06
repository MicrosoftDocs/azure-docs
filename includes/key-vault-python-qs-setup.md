---
author: msmbaldwin
ms.service: key-vault
ms.topic: include
ms.date: 09/03/2020
ms.author: msmbaldwin

# Used by Python quickstarts for secrets, keys, and certificates

---

1. Make sure you have an [Azure account with an active subscription](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

1. Install [Python 2.7+ or 3.5.3+](https://www.python.org/downloads).

1. Install the [Azure CLI](/cli/azure/install-azure-cli).

1. Follow the instructions on [Configure authentication for local development](/azure/developer/python/configure-local-development-environment?tabs=cmd#configure-authentication), with which you create a local service principal and make it available to the Azure Key Vault Client for Python through environment variables. 

    When running code directly on Azure, a separate service principal is not needed if the app uses managed identity.

1. In a terminal or command prompt, create a suitable project folder, and then create and activate a Python virtual environment as described on [Use Python virtual environments](/azure/developer/python/configure-local-development-environment?tabs=cmd#use-python-virtual-environments)

1. Install the Azure Active Directory identity library:

    ```terminal
    pip install azure.identity
    ```
