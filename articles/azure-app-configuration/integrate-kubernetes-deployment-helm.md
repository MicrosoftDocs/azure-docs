---
title: "Integrate Azure App Configuration with Kubernetes Deployment using Helm"
description: Learn how to use dynamic configurations in Kubernetes deployment with Helm. 
services: azure-app-configuration
author: shuawan
manager: zhenlwa

ms.service: azure-app-configuration
ms.topic: tutorial
ms.date: 04/14/2020
ms.author: shuawan

#Customer intent: I want to use Azure App Configuration data in Kubernetes deployment with Helm. 
---
# Integrate with Kubernetes Deployment Using Helm

This article explains how to use data from Azure App Configuration in Kubernetes deployment with Helm. 

## Prerequisites

- [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
- Install [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest)
- Install [Helm](https://helm.sh/docs/intro/install/)
- Background knowledge for installing applications with Helm in [Azure Kubernetes Service](https://docs.microsoft.com/en-us/azure/aks/kubernetes-helm)

## Create Helm chart ##
```powershell
# Create sample Helm chart
helm create mychart
```
Helm will create a new directory in your project called mychart with the structure shown below. 
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

Details to understand [mychart](https://helm.sh/docs/chart_template_guide/getting_started/)

Based on the sample **deployment.yaml** file, we modify the chart to add some environment variables to container under ```spec:template:spec:containers```. Although this setting won't be used by the application, it shows as an example for how to dynamically pass configurations into Helm deployment.

```yaml
env:
- name: Color
    value: {{ .Values.color }}
- name: Message
    value: {{ .Values.message }}
``` 

The modified deployment.yaml should look like below. 

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
              value: {{ .Values.color }}
            - name: Message
              value: {{ .Values.message }}
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

In addition, add **secrets.yaml** under templates for Kubernetes Secrets, which is used to store and manage sensitive information, such as passwords. Same with environment variables, Secrets can also be referenced by application. 
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  password: {{ .Values.password }}
```

In **values.yaml**, there are some default settings used for chart. Let's add some place holder for configurations we added above. Settings in **values.yaml** can be later on combined and overwritten by configurations pulled from App Configuration. 

```yaml
# Default values for mychart.
# This is a YAML-formatted file.
# Declare variables to be passed into your templates.

replicaCount: 1

image:
  repository: nginx
  tag: stable
  pullPolicy: IfNotPresent

nameOverride: ""
fullnameOverride: ""

service:
  type: ClusterIP
  port: 80

ingress:
  enabled: false
  annotations: {}
    # kubernetes.io/ingress.class: nginx
    # kubernetes.io/tls-acme: "true"
  path: /
  hosts:
    - chart-example.local
  tls: []
  #  - secretName: chart-example-tls
  #    hosts:
  #      - chart-example.local

resources: {}
  # We usually recommend not to specify default resources and to leave this as a conscious
  # choice for the user. This also increases chances charts run on environments with little
  # resources, such as Minikube. If you do want to specify resources, uncomment the following
  # lines, adjust them as necessary, and remove the curly braces after 'resources:'.
  # limits:
  #  cpu: 100m
  #  memory: 128Mi
  # requests:
  #  cpu: 100m
  #  memory: 128Mi

nodeSelector: {}

tolerations: []

affinity: {}

# settings will be overwritten by App Configuration
color: red
message: myMessage

password: null
```

## Create an App Configuration store

[!INCLUDE [azure-app-configuration-create](../../includes/azure-app-configuration-create.md)]

6. Select **Configuration Explorer** > **Create** to add the following key-value pairs:

    | Key | Value |
    |---|---|
    | color | White |
    | message | Data from Azure App Configuration |

    Leave **Label** and **Content Type** empty for now.

## Add a secret to Key Vault

To add a secret to the vault, you need to take just a few additional steps. In this case, add a message that you can use to test Key Vault retrieval. The message is called **Message**, and you store the value "Hello from Key Vault" in it.

1. From the Key Vault properties pages, select **Secrets**.
1. Select **Generate/Import**.
1. In the **Create a secret** pane, enter the following values:
    - **Upload options**: Enter **Manual**.
    - **Name**: Enter **Password**.
    - **Value**: Enter **myPassword**.
1. Leave the other **Create a secret** properties with their default values.
1. Select **Create**.

## Add a Key Vault reference to App Configuration

1. Sign in to the [Azure portal](https://portal.azure.com). Select **All resources**, and then select the App Configuration store instance that you created in the quickstart.

1. Select **Configuration Explorer**.

1. Select **+ Create** > **Key vault reference**, and then specify the following values:
    - **Key**: Select **KVRef_password**.
    - **Label**: Leave this value blank.
    - **Subscription**, **Resource group**, and **Key vault**: Enter the values corresponding to those in the key vault you created in the previous section.
    - **Secret**: Select the secret named **Password** that you created in the previous section.

## Merge data from App Configuration ##
In App Configuration, there are normal configurations along with key vault references and if no need to resolve those references in deployment time, then pull all data in one shot. 
```PowerShell
$ConfigFilePath="config.yaml"

# Export configurations to local files
az appconfig kv export -n myAppConfiguration -d file --path config.yaml --format yaml -y
```

If there is a need to resolve the content of key vault references like secrets, then separate them into two files.
```PowerShell
$ConfigFilePath=config.yaml
$SecretPath=secrets.yaml

# Export configurations excluding key vault reference to local files
az appconfig kv export -n myAppConfiguration -d file --path $ConfigFilePath --skip-keyvault --format yaml -y

# Export content of key vault references to local files
az appconfig kv export --key "KVRef_*" --prefix "KVRef_" -n myAppConfiguration -d file --path $SecretPath --resolve-keyvault --format yaml -y

# Export content of key vault references to memory if there is concern for putting sensitive data in persistent storage.
$data = az appconfig kv list --key "KVRef_*" -n myAppConfiguration --resolve-keyvault
```

There are [two ways](https://helm.sh/docs/intro/using_helm/) to pass configuration data during helm install. Helm allow passing files or literal key values to overwrite settings specified in values.yaml. 
```PowerShell
# Deploy the helm chart.
helm upgrade --install -f $ConfigFilePath -f $SecretPath --set service.type=NodePort "example" ./mychart 
```

We can verify by accessing [Kubernetes Dashboard](https://docs.microsoft.com/en-us/azure/aks/kubernetes-dashboard)
![Quickstart app launch local](./media/kubernetes-dashboard-env-variables.png)
![Quickstart app launch local](./media/kubernetes-dashboard-secrets.png)

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this tutorial, you exported Azure App Configuration data to be used in a Kubernetes deployment with Helm. To learn more about how to use App Configuration, continue to the Azure CLI samples.

> [!div class="nextstepaction"]
> [Managed identity integration](./howto-integrate-azure-managed-service-identity.md)
