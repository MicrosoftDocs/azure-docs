---
title: "Integrate Azure App Configuration with Kubernetes Deployment using Helm"
description: Learn how to use dynamic configurations in Kubernetes deployment with Helm. 
services: azure-app-configuration
author: shenmuxiaosen
manager: zhenlan

ms.service: azure-app-configuration
ms.topic: tutorial
ms.date: 04/14/2020
ms.author: shuawan

#Customer intent: I want to use Azure App Configuration data in Kubernetes deployment with Helm. 
---
# Integrate with Kubernetes Deployment Using Helm

In this tutorial, we will use a sample Helm chart and show how to generate configurations and secrets from the App Configuration that can be used in Kubernetes deployment.

## Prerequisites

- [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
- Install [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) (version 2.4.0 or later)
- Install [Helm](https://helm.sh/docs/intro/install/) (version 2.14.0 or later)
- A Kubernetes cluster.

This tutorial assumes basic understanding of managing Kubernetes with Helm. Learn more about installing applications with Helm in [Azure Kubernetes Service](https://docs.microsoft.com/azure/aks/kubernetes-helm).

## Create an App Configuration store

[!INCLUDE [azure-app-configuration-create](../../includes/azure-app-configuration-create.md)]

6. Select **Configuration Explorer** > **Create** to add the following key-value pairs:

    | Key | Value |
    |---|---|
    | settings.color | White |
    | settings.message | Data from Azure App Configuration |

    Leave **Label** and **Content Type** empty for now.

## Add a Key Vault reference to App Configuration
1. Sign in to the [Azure portal](https://portal.azure.com) and add a secret to [Key Vault](https://docs.microsoft.com/en-us/azure/key-vault/secrets/quick-create-portal#add-a-secret-to-key-vault) with name **Password** and value **myPassword**. 
2. Select the App Configuration store instance that you created in previous section.

1. Select **Configuration Explorer**.

1. Select **+ Create** > **Key vault reference**, and then specify the following values:
    - **Key**: Select **secrets.password**.
    - **Label**: Leave this value blank.
    - **Subscription**, **Resource group**, and **Key vault**: Enter the values corresponding to those in the key vault you created in previous step.
    - **Secret**: Select the secret named **Password** that you created in the previous section.

## Create Helm chart ##
First, we will create a sample Helm chart with the following command
```console
helm create mychart
```

Helm will create a new directory called mychart with the structure shown below. You can follow the [charts guide](https://helm.sh/docs/chart_template_guide/getting_started/) to learn more.
```
mychart
|-- Chart.yaml
|-- charts
|-- templates
|   |-- NOTES.txt
|   |-- _helpers.tpl
|   |-- deployment.yaml
|   |-- ingress.yaml
|   `-- service.yaml
`-- values.yaml
```

Next, we will update the *deployment.yaml* file and add the following snippet which adds two environment variables to the container under **spec:template:spec:containers**. It shows how to dynamically pass configurations into deployment.

```yaml
env:
- name: Color
    value: {{ .Values.settings.color }}
- name: Message
    value: {{ .Values.settings.message }}
``` 

The complete *deployment.yaml* file after the update should look like below.

```yaml
apiVersion: apps/v1beta2
kind: Deployment
metadata:
  name: {{ include "mychart.fullname" . }}
  labels:
    app.kubernetes.io/name: {{ include "mychart.name" . }}
    helm.sh/chart: {{ include "mychart.chart" . }}
    app.kubernetes.io/instance: {{ .Release.Name }}
    app.kubernetes.io/managed-by: {{ .Release.Service }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      app.kubernetes.io/name: {{ include "mychart.name" . }}
      app.kubernetes.io/instance: {{ .Release.Name }}
  template:
    metadata:
      labels:
        app.kubernetes.io/name: {{ include "mychart.name" . }}
        app.kubernetes.io/instance: {{ .Release.Name }}
    spec:
      containers:
        - name: {{ .Chart.Name }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          env:
            - name: Color
              value: {{ .Values.settings.color }}
            - name: Message
              value: {{ .Values.settings.message }}
          ports:
            - name: http
              containerPort: 80
              protocol: TCP
          livenessProbe:
            httpGet:
              path: /
              port: http
          readinessProbe:
            httpGet:
              path: /
              port: http
          resources:
{{ toYaml .Values.resources | indent 12 }}
    {{- with .Values.nodeSelector }}
      nodeSelector:
{{ toYaml . | indent 8 }}
    {{- end }}
    {{- with .Values.affinity }}
      affinity:
{{ toYaml . | indent 8 }}
    {{- end }}
    {{- with .Values.tolerations }}
      tolerations:
{{ toYaml . | indent 8 }}
    {{- end }}
```

Then we add a *secrets.yaml* file under the templates folder with following content. It will be used to store Kubernetes Secrets, such as passwords. The secrets will be accessible from inside the container. Learn more about how to use [Kubernetes Secrets](https://kubernetes.io/docs/concepts/configuration/secret/#using-secrets).

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  password: {{ .Values.secrets.password }}
```

Finally, we can update the *values.yaml* file with the following content to optionally provide default values of the configuration settings and secrets that we referenced in the *deployment.yaml* and *secrets.yaml* files earlier. Their actual values will be overwritten by configuration pulled from the App Configuration.

```yaml
# settings will be overwritten by App Configuration
settings:
	color: red
	message: myMessage
```

## Pass configuration data from App Configuration during Helm install ##
First, we download the configuration from App Configuration to a *myConfig.yaml* file. We use a key filter to only download those keys that start with **settings.**. If in your case the key filter is not sufficient to exclude keys of Key Vault references, you may use the argument **--skip-keyvault** to exclude them. Learn more about the [export command](https://docs.microsoft.com/en-us/cli/azure/appconfig/kv?view=azure-cli-latest#az-appconfig-kv-export). 
```azurecli-interactive
az appconfig kv export -n myAppConfiguration -d file --path myConfig.yaml --key "settings.*"  --separator "." --format yaml
```

Then we download secrets to a *mySecrets.yaml* file. Note the parameter **--resolve-keyvault** is used so the Key Vault references will be resolved and the actual values in the Key Vault will be retrieved. Make sure the credential that is used to run this command has access permission to the corresponding Key Vault. As this file contains sensitive information, keep the file with care and clean up when it's not needed anymore.
```azurecli-interactive
az appconfig kv export -n myAppConfiguration -d file --path mySecrets.yaml --key "secrets.*" --separator "." --resolve-keyvault --format yaml
```

In the end, pass those two files during Helm install with argument **-f** to overwrite *values.yaml*.
```console
helm upgrade --install -f myConfig.yaml -f mySecrets.yaml "example" ./mychart 
```

If there is a concern for putting sensitive data in persistent storage, export content of key vault references to memory. Besides files Helm also allows passing literal key values with argument **--set**. Learn more about [Helm usage](https://helm.sh/docs/intro/using_helm/).

```powershell
$secrets = az appconfig kv list -n myAppConfiguration1157 --key "secrets.*" --resolve-keyvault --query "[*].{name:key, value:value}" | ConvertFrom-Json

foreach ($secret in $secrets) {
  $keyvaules += $secret.name + "=" + $secret.value + ","
}

if ($keyvaules){
  $keyvaules = $keyvaules.TrimEnd(',')
  helm upgrade --install --set $keyvaules "example" ./mychart 
}
else{
  helm upgrade --install "example" ./mychart 
}

```

We can verify configurations and secrets are successfully pulled by accessing [Kubernetes Dashboard](https://docs.microsoft.com/azure/aks/kubernetes-dashboard). Two settings, **color** and **message**, stores in App Configuration were populated into container's environment variables.
![Quickstart app launch local](./media/kubernetes-dashboard-env-variables.png)
One secret, **password**, stores as Key Vault reference in App Configuration was also added into Kubernetes Secrets. 
![Quickstart app launch local](./media/kubernetes-dashboard-secrets.png)

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this tutorial, you exported Azure App Configuration data to be used in a Kubernetes deployment with Helm. To learn more about how to use App Configuration, continue to the Azure CLI samples.

> [!div class="nextstepaction"]
> [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/appconfig?view=azure-cli-latest)
