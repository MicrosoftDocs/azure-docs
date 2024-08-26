---
author: santiagxf
ms.service: azure-machine-learning
ms.topic: include
ms.date: 08/16/2024
ms.author: fasantia
---

For interactive jobs where there's a user connected to the session, you can rely on Interactive Authentication and hence no further action is required.

> [!WARNING]
> *Interactive browser* authentication blocks code execution when it prompts for credentials. This approach isn't suitable for authentication in unattended environments like training jobs. We recommend that you configure a different authentication mode.

For those scenarios where unattended execution is required, you have to configure a service principal to communicate with Azure Machine Learning.

# [MLflow SDK](#tab/mlflow)

```python
import os

os.environ["AZURE_TENANT_ID"] = "<AZURE_TENANT_ID>"
os.environ["AZURE_CLIENT_ID"] = "<AZURE_CLIENT_ID>"
os.environ["AZURE_CLIENT_SECRET"] = "<AZURE_CLIENT_SECRET>"
```

# [Using environment variables](#tab/environ)

```bash
export AZURE_TENANT_ID="<AZURE_TENANT_ID>"
export AZURE_CLIENT_ID="<AZURE_CLIENT_ID>"
export AZURE_CLIENT_SECRET="<AZURE_CLIENT_SECRET>"
```

---

> [!TIP]
> When working on shared environments, we recommend that you configure these environment variables at the compute. As a best practice, manage them as secrets in an instance of Azure Key Vault.
>
> For instance, in Azure Databricks you can use secrets in environment variables as follows in the cluster configuration: `AZURE_CLIENT_SECRET={{secrets/<scope-name>/<secret-name>}}`. For more information about implementing this approach in Azure Databricks, see [Reference a secret in an environment variable](/azure/databricks/security/secrets/secrets#reference-a-secret-in-an-environment-variable) or refer to documentation for your platform.
