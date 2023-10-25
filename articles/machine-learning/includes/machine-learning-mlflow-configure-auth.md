---
author: santiagxf
ms.service: machine-learning
ms.topic: include
ms.date: 01/02/2023
ms.author: fasantia
---

For interactive jobs where there's a user connected to the session, you can rely on Interactive Authentication and hence no further action is required.

> [!WARNING]
> __Interactive browser__ authentication will block code execution when prompting for credentials. It is not a suitable option for authentication in unattended environments like training jobs. We recommend to configure other authentication mode.

For those scenarios where unattended execution is required, you'll have to configure a service principal to communicate with Azure Machine Learning.

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
> When working on shared environments, it is advisable to configure these environment variables at the compute. As a best practice, manage them as secrets in an instance of Azure Key Vault whenever possible. For instance, in Azure Databricks you can use secrets in environment variables as follows in the cluster configuration: `AZURE_CLIENT_SECRET={{secrets/<scope-name>/<secret-name>}}`. See [Reference a secret in an environment variable](/azure/databricks/security/secrets/secrets#reference-a-secret-in-an-environment-variable) for how to do it in Azure Databricks or refer to similar documentation in your platform.
