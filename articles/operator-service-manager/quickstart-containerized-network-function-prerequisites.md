---

title: Prerequisites for Using Azure Operator Service Manager
description: Use this Quickstart to install and configure the necessary prerequisites for Azure Operator Service Manager
author: HollyCl
ms.author: hollycl
ms.service: azure-operator-service-manager
ms.topic: quickstart
ms.date: 09/08/2023
---

# Quickstart: Complete the prerequisites to deploy a Containerized Network Function in Azure Operator Service Manager

In this Quickstart, you complete the tasks necessary prior to using the Azure Operator Service Manager (AOSM). 

## Prerequisites

An Azure account with an active subscription. If you don't have an Azure subscription, request access via [partner registration form](https://forms.office.com/pages/responsepage.aspx?id=v4j5cvGGr0GRqy180BHbR7lMzG3q6a5Hta4AIflS-llUMlNRVVZFS00xOUNRM01DNkhENURXU1o2TS4u).

## Download and install Azure CLI

Use the Bash environment in the Azure cloud shell. For more information, see [Start the Cloud Shell](/azure/cloud-shell/quickstart?tabs=azurecli) to use Bash environment in Azure Cloud Shell.

For users that prefer to run CLI reference commands locally refer to [How to install the Azure CLI](/cli/azure/install-azure-cli).

If you're running on Window or macOS, consider running Azure CLI in a Docker container. For more information, see [How to run the Azure CLI in a Docker container](/cli/azure/run-azure-cli-docker).

If you're using a local installation, sign into the Azure CLI using the `az login` command and complete the prompts displayed in your terminal to finish authentication. For more sign-in options, refer to [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli).

### Install Azure Operator Service Manager (AOSM) CLI extension

Install the Azure Operator Service Manager (AOSM) CLI extension using this command:

```azurecli
az extension add --name aosm
```
1. Run `az version` to see the version and dependent libraries that are installed.
1. Run `az upgrade` to upgrade to the current version of Azure CLI.

## Register and verify required resource providers

Before you begin using the Azure Operator Service Manager, make sure to register the required resource provider. Execute the following commands. This registration process may take up to 5 minutes.

```azurecli
# Register Resource Provider
az provider register --namespace Microsoft.HybridNetwork
az provider register --namespace Microsoft.ContainerRegistry
```

Verify the registration status of the resource providers. Execute the following commands.

```azurecli
# Query the Resource Provider
az provider show -n Microsoft.HybridNetwork --query "{RegistrationState: registrationState, ProviderName: namespace}"
az provider show -n Microsoft.ContainerRegistry --query "{RegistrationState: registrationState, ProviderName: namespace}"
```

> [!NOTE]
> It may take a few minutes for the resource provider registration to complete. Once the registration is successful, you can proceed with using the Azure Operator Service Manager (AOSM).

## Requirements for Containerized Network Function (CNF)

For those utilizing Containerized Network Functions, it's essential to ensure that the following packages are installed on the machine from which you're executing the CLI:

- **Install docker**, refer to [Install the Docker Engine](https://docs.docker.com/engine/install/).
- **Install Helm**, refer to [Install Helm CLI](https://helm.sh/docs/intro/install/).

### Configure Containerized Network Function (CNF) deployment

For deployments of Containerized Network Functions (CNFs), it's crucial to have the following installed on the machine from which you're executing the CLI:

- **Helm Packages with Schema** - These packages should be present on your local storage and referenced within the `input.json` configuration file.
- **Creating a Sample Configuration File** - Generate an example configuration file for defining a CNF deployment. Issue this command to generate an `input.json` file that you need to populate with your specific configuration.

    ```azurecli
    az aosm nfd generate-config
    ```

- **Images for your CNF** - Here are the options:
  - A reference to an existing Azure Container Registry that contains the images for your CNF. Currently, only one ACR and namespace are supported per CNF. The images to be copied from this ACR are populated automatically based on the helm package schema. You must have Reader/AcrPull permissions on this ACR. To use this option, fill in `source_registry` and optionally `source_registry_namespace` in the input.json file.
  - The image name of the source docker image from local machine. This image name is for a limited use case where the CNF only requires a single docker image that exists in the local docker repository. To use this option, fill in `source_local_docker_image` in the input.json file. Requires docker to be installed.
- **Optional: Mapping File (path_to_mappings)**: Optionally, you can provide a file (on disk) named path_to_mappings. This file should mirror `values.yaml`,  with your selected values replaced by deployment parameters. Doing so exposes them as parameters to the CNF. You can either leave the values as blank strings to have every value as a deployment parameter or use the `--interactive` option to interactively make choices.

When configuring the `input.json` file, ensure that you list the Helm packages in the order they should be deployed. For instance, if package "A" must be deployed before package "B," your `input.json` should resemble the following structure:

```json
"helm_packages": [
    {
        "name": "A",
        "path_to_chart": "Path to package A",
        "path_to_mappings": "Path to package A mappings",
        "depends_on": [
            "Names of the Helm packages this package depends on"
        ]
    },
    {
        "name": "B",
        "path_to_chart": "Path to package B",
        "path_to_mappings": "Path to package B mappings",
        "depends_on": [
            "Names of the Helm packages this package depends on"
        ]
    }
]
```
Following these guidelines ensures a well organized and structured approach to deploy Containerized Network Functions (CNFs) with Helm packages and associated configurations.

### Download nginx image to local docker repo

For this quickstart, you  download docker to your local repository. The Azure Operator Service Manager (AOSM) Azure CLI extension pushes the image from there to the Azure Operator Service Manager (AOSM) Artifact Store ACR. The CLI extension also supports copying the image from an existing ACR. Copying the image is the expected default use-case, but  it's slower for a quickstart to create an ACR to copy from so this method isn't used here.

Issue the following command: `docker pull nginx:stable`

## Dive into Helm charts

This section introduces you to a basic Helm chart that sets up nginx and configures it to listen on a specified port. The Helm chart furnished in this section already incorporates a `values.schema.json` file.

### Sample values.schema.json file

```json
{
    "$schema": "http://json-schema.org/draft-07/schema",
    "additionalProperties": true,
    "properties": {
        "affinity": {
            "additionalProperties": false,
            "properties": {},
            "type": "object"
        },
        "fullnameOverride": {
            "type": "string"
        },
        "image": {
            "additionalProperties": false,
            "properties": {
                "pullPolicy": {
                    "type": "string"
                },
                "repository": {
                    "type": "string"
                },
                "tag": {
                    "type": "string"
                }
            },
            "type": "object"
        },
        "imagePullSecrets": {
            "items": {
                "anyOf": []
            },
            "type": "array"
        },
        "ingress": {
            "additionalProperties": false,
            "properties": {
                "annotations": {
                    "additionalProperties": false,
                    "properties": {},
                    "type": "object"
                },
                "enabled": {
                    "type": "boolean"
                },
                "hosts": {
                    "items": {
                        "anyOf": [
                            {
                                "additionalProperties": false,
                                "properties": {
                                    "host": {
                                        "type": "string"
                                    },
                                    "paths": {
                                        "items": {
                                            "anyOf": []
                                        },
                                        "type": "array"
                                    }
                                },
                                "type": "object"
                            }
                        ]
                    },
                    "type": "array"
                },
                "tls": {
                    "items": {
                        "anyOf": []
                    },
                    "type": "array"
                }
            },
            "type": "object"
        },
        "nameOverride": {
            "type": "string"
        },
        "nodeSelector": {
            "additionalProperties": false,
            "properties": {},
            "type": "object"
        },
        "podSecurityContext": {
            "additionalProperties": false,
            "properties": {},
            "type": "object"
        },
        "replicaCount": {
            "type": "integer"
        },
        "resources": {
            "additionalProperties": false,
            "properties": {},
            "type": "object"
        },
        "securityContext": {
            "additionalProperties": false,
            "properties": {},
            "type": "object"
        },
        "service": {
            "additionalProperties": false,
            "properties": {
                "port": {
                    "type": "integer"
                },
                "type": {
                    "type": "string"
                }
            },
            "type": "object"
        },
        "serviceAccount": {
            "additionalProperties": false,
            "properties": {
                "create": {
                    "type": "boolean"
                },
                "name": {
                    "type": "null"
                }
            },
            "type": "object"
        },
        "tolerations": {
            "items": {
                "anyOf": []
            },
            "type": "array"
        }
    },
    "type": "object"
}
```

Although this article doesn't delve into the intricacies of Helm, a few elements worth highlighting include:

- **Service Port Configuration:** The `values.yaml` has a preset with a service port of 80.

### Sample values.yaml file

```yml
# Default values for nginxdemo. 
# This is a YAML-formatted file. 
# Declare variables to be passed into your templates. 

 
replicaCount: 1 
 

image: 

  # Repository gets overwritten by AOSM to the Artifact Store ACR, however we've hard-coded the image name and tag in deployment.yaml 

  repository: overwriteme 
  tag: stable 
  pullPolicy: IfNotPresent 


imagePullSecrets: [] 
nameOverride: "" 
fullnameOverride: "" 

 
serviceAccount: 

  # Specifies whether a service account should be created 

  create: false 

  # The name of the service account to use. 
  # If not set and create is true, a name is generated using the fullname template 

  name: 
 

podSecurityContext: 

  {} 

  # fsGroup: 2000 

 
securityContext: 

  {} 
  # capabilities: 
  #   drop: 
  #   - ALL 
  # readOnlyRootFilesystem: true 
  # runAsNonRoot: true 
  # runAsUser: 1000 

 
service: 

  type: ClusterIP 
  port: 80 

  
ingress: 

  enabled: false 
  annotations: 

    {} 

    # kubernetes.io/ingress.class: nginx 
    # kubernetes.io/tls-acme: "true" 

  hosts: 

    - host: chart-example.local 
      paths: [] 

  
  tls: [] 

  #  - secretName: chart-example-tls 
  #    hosts: 
  #      - chart-example.local 

 
resources: 

  {} 

  # We usually recommend not to specify default resources and to leave this as a conscious 
  # choice for the user. This also increases chances charts run on environments with little 
  # resources, such as Minikube. If you do want to specify resources, uncomment the following 
  # lines, adjust them as necessary, and remove the curly braces after 'resources:'. 
  # limits: 
  #   cpu: 100m 
  #   memory: 128Mi 
  # requests: 
  #   cpu: 100m 
  #   memory: 128Mi 
 

nodeSelector: {} 

 
tolerations: [] 

 
affinity: {}
```

- **Port References:** This port finds its use in multiple locations:

  - Within `service.yaml` as `{{ Values.service.port }}`

### Sample service.yaml file

```yml
apiVersion: v1 
kind: Service 

metadata: 
  name: {{ include "nginxdemo.fullname" . }} 
  labels: 

{{ include "nginxdemo.labels" . | indent 4 }} 

spec: 
  type: {{ .Values.service.type }} 
  ports: 
    - port: {{ .Values.service.port }} 
      targetPort: http 
      protocol: TCP 
      name: http 

  selector: 
    app.kubernetes.io/name: {{ include "nginxdemo.name" . }} 
    app.kubernetes.io/instance: {{ .Release.Name }}
```

- In `nginx_config_map.yaml` represented as `{{ Values.service.port }}`. This file corresponds to `/etc/nginx/conf.d/default.conf`, with a mapping established using a config map in `deployment.yaml`.

### Sample nginx_config_map.yaml file

```yml
apiVersion: v1 
kind: ConfigMap 
metadata: 
  name: nginx-config 
# This writes the nginx config file to the ConfigMap and deployment.yaml mounts it as a volume  
# to the right place. 

data: 
  default.conf: | 
    log_format client '$remote_addr - $remote_user $request_time $upstream_response_time ' 
                    '[$time_local] "$request" $status $body_bytes_sent $request_body "$http_referer" ' 
                    '"$http_user_agent" "$http_x_forwarded_for"'; 

    server { 
        listen       80; 
        listen       {{ .Values.service.port }}; 
        listen  [::]:80; 
        server_name  localhost; 

        access_log  /var/log/nginx/host.access.log  client; 

        location / { 
            root   /usr/share/nginx/html; 
            index  index.html index.htm; 
            error_page 405 =200 $uri; 
        } 


        #error_page  404              /404.html; 
        # redirect server error pages to the static page /50x.html 
        # 
        error_page   500 502 503 504  /50x.html; 
        location = /50x.html { 
            root   /usr/share/nginx/html; 
        } 


        location = /cnf/test {   
            error_page 405 =200 $uri; 
        } 
   

        location = /post_thing { 
            # turn off logging here to avoid double logging 
            access_log off; 
            error_page 405 =200 $uri; 
        } 
    }
```

**Deployment Configuration:** The `deployment.yaml` file showcases specific lines pertinent to `imagePullSecrets` and `image`. Be sure to observe their structured format, as Azure Operator Service Manager (AOSM) furnishes the necessary values for these fields during deployment.

**Sample deployment.yaml file**

```yml
apiVersion: apps/v1 
kind: Deployment 
metadata: 
  name: {{ include "nginxdemo.fullname" . }} 
  labels: 
{{ include "nginxdemo.labels" . | indent 4 }} 

spec: 
  replicas: {{ .Values.replicaCount }} 
  selector: 
    matchLabels: 
      app.kubernetes.io/name: {{ include "nginxdemo.name" . }} 
      app.kubernetes.io/instance: {{ .Release.Name }} 

  template: 
    metadata: 
      labels: 
        app.kubernetes.io/name: {{ include "nginxdemo.name" . }} 
        app.kubernetes.io/instance: {{ .Release.Name }} 

    spec: 
      # Copied from sas 
      imagePullSecrets: {{ mustToPrettyJson (ternary (list ) .Values.imagePullSecrets (kindIs "invalid" .Values.imagePullSecrets)) }} 
      serviceAccountName: {{ template "nginxdemo.serviceAccountName" . }} 
      securityContext: 
        {{- toYaml .Values.podSecurityContext | nindent 8 }} 
      containers: 
        - name: {{ .Chart.Name }} 
          securityContext: 
            {{- toYaml .Values.securityContext | nindent 12 }} 
          # Want this to evaluate to acr-name.azurecr.io/nginx:stable (or specific version) 
          # docker tag nginx:stable acr-name.azurecr.io/nginx:stable 
          # docker push acr-name.azurecr.io/nginx:stable 
          # Image hard coded to that put in the Artifact Store ACR for this CNF POC 
          image: "{{ .Values.image.repository }}/nginx:stable" 
          imagePullPolicy: {{ .Values.image.pullPolicy }} 
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
            {{- toYaml .Values.resources | nindent 12 }} 
          # Gets the nginx config from the configMap - see nginx_config_map.yaml 
          volumeMounts: 
            - name: nginx-config-volume 
              mountPath: /etc/nginx/conf.d/default.conf 
              subPath: default.conf 
      volumes: 
        - name: nginx-config-volume 
          configMap: 
            name: nginx-config 
      {{- with .Values.nodeSelector }} 
      nodeSelector: 
        {{- toYaml . | nindent 8 }} 
      {{- end }} 
    {{- with .Values.affinity }} 
      affinity: 
        {{- toYaml . | nindent 8 }} 
    {{- end }} 
    {{- with .Values.tolerations }} 
      tolerations: 
        {{- toYaml . | nindent 8 }} 
    {{- end }}
```

## Next steps

- [Quickstart: Publish Nginx container as Containerized Network Function (CNF)](quickstart-publish-containerized-network-function-definition.md)