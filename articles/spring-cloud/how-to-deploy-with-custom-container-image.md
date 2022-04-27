---
title: How to deploy applications in Azure Spring Cloud with a custom container image (Preview)
description: How to deploy applications in Azure Spring Cloud with a custom container image
author: karlerickson
ms.author: xiangy
ms.topic: how-to
ms.service: spring-cloud
ms.date: 4/27/2022
---

# Deploy an application with a custom container image (Preview)

**This article applies to:** ✔️ Standard tier ✔️ Enterprise tier

This article explains how to deploy Spring Boot applications in Azure Spring Cloud using a custom container image. Deploying an application with a custom container supports most features as when deploying a JAR application. Other Java and non-Java applications can also be deployed with the container image.
 
## Prerequisites 
* A container image containing the application
* The image is pushed to an image registry. For more information, see [Azure Container Registry](/azure/container-instances/container-instances-tutorial-prepare-acr)
  
> [!NOTE]
> The web application must listen on port `1025` for Standard tier and on port `8080` for Enterprise tier. The way to change the port depends on the framework of the application. For example, specify `SERVER_PORT=1025` for Spring Boot applications or `ASPNETCORE_URLS=http://+:1025/` for ASP.Net Core applications. The probe can be disabled for applications that do not listen on any port.

## How to deploy your application 

# [Azure CLI](#tab/azure-cli)

1. To deploy a container image, use one of the following commands:
    1. To deploy a container image `contoso/your-app:v1` on the public Docker Hub to an app, use the following command:

       ```azurecli
       az spring-cloud app deploy \
          -name <MyApp> \
          -service <MyCluster> \
          -group <MyResourceGroup> \
          --container-image contoso/your-app:v1
       ```

    1. To deploy a container image `myacr.azurecr.io/your-app:v1` from ACR to an app, use the following command:

       ```azurecli
       az spring-cloud app deploy \
          -name <MyApp> \
          -service <MyCluster> \
          -group <MyResourceGroup> \
          --container-image your-app:v1 \
          --container-registry myacr.azurecr.io \
          --registry-username myacr \
          --registry-password <password>
        ```

    1. To deploy a container image `registry.consoto.com/your-app:v1` from another private registry to an app, use the following command:

       ```azurecli
       az spring-cloud app deploy \
          -name <MyApp> \
          -service <MyCluster> \
          -group <MyResourceGroup> \
          --container-image your-app:v1 \
          --container-registry registry.consoto.com \
          --registry-username <username> \
          --registry-password <password>
        ```

1. To overwrite the entry point of the image, add the following two arguments to any of the above commands:

   ```xml
   --container-command "java" \
   --container-args "-jar /app.jar -Dkey=value"
   ```

1. To disable listening on a port for images that are not web applications, add the following argument to the above commands:
   ```xml
   --disable-probe true
   ```

# [Portal](#tab/azure-portal)

:::image type="content" source="media/how-to-deploy-with-custom-container-image/create-custom-container-app-1.png" alt-text="Create App 1.":::

:::image type="content" source="media/how-to-deploy-with-custom-container-image/create-custom-container-app-2.png" alt-text="Create App 2.":::
 
The `Commands` and `Arguments` field are optional, which are used to overwrite the `cmd` and `entrypoint` of the image.

You need to also specify the `Language Framework`, which is the web framework of the container image used. Currently only `Spring Boot` is supported. For other Java applications or non-Java (polyglot) applications please choose `Polyglot`.

---

## Feature Support matrix 

The following matrix shows what features are supported in each application type.

| Feature  | Spring Boot Apps - container deployment  | Polyglot Apps - container deployment  | Notes  |
|---|---|---|---|
| App lifecycle management                                        | Y | Y |   |
| Support for container registries                                | Y | Y |   | 
| Assign endpoint                                                 | Y | Y |   |
| Azure Monitor                                                   | Y | Y |   |
| APM integration                                                 | Y | Y | Supported by [manual installation](#how-to-install-an-apm-into-the-image-manually)  |
| Blue/green deployment                                           | Y | Y |   |
| Custom domain                                                   | Y | Y |   |
| Scaling - auto scaling                                          | Y | Y |   |
| Scaling - manual scaling (in/out, up/down)                      | Y | Y |   |
| Managed Identity                                                | Y | Y |   |
| Spring Cloud Eureka & Config Server                             | Y | N |   |
| API portal for VMware Tanzu®                                    | Y | Y | Enterprise tier only  |
| Spring Cloud Gateway for VMware Tanzu®                          | Y | Y | Enterprise tier only  |
| Application Configuration Service for VMware Tanzu®             | Y | N | Enterprise tier only  |
| VMware Tanzu® Service Registry                                  | Y | N | Enterprise tier only  |
| VNET                                                            | Y | Y | Need to [whitelist the registry in NSG or Azure Firewall](#why-cant-connect-to-the-container-registry-in-vnet)  |
| Outgoing IP Address                                             | Y | Y |   |
| E2E TLS                                                         | Y | Y | Trust a self-signed CA is supported by [manual installation](#how-to-trust-a-ca-in-the-image)  |
| Liveness and readiness settings                                 | Y | Y |   |
| Advanced troubleshooting - thread/heap/JFR dump                 | Y | N | The image must include `bash` and JDK with `PATH` specified.   |
| Bring your own storage                                          | Y | Y |   |
| Integrate service binding with Resource Connector               | Y | N |   |
| Availability Zone                                               | Y | Y |   |
| App Lifecycle events                                            | Y | Y |   |
| Reduced app size - 0.5 vCPU and 512 MB                          | Y | Y |   |
| Automate app deployments with Terraform                         | Y | Y |   |
| Soft Deletion                                                   | Y | Y |   |
| Interactive diagnostic experience (AppLens-based)               | Y | Y |   |
| SLA                                                             | Y | Y |   |


> [!NOTE]
> Polyglot apps include non-Spring Boot Java, NodeJS, AngularJS, Python, and .NET apps.

## Common points to be aware of when deploying with a custom container

The following points will help you address common situations when deploying with a custom image.
### How to trust a Certificate Authority (CA) in the image

To trust a CA in the image, set the following variables depending on your environment:

1. Java applications must be imported into the trust store by adding the following lines into your `Dockerfile`:

   ```xml
   ADD EnterpriseRootCA.crt /opt/
   RUN keytool -keystore /etc/ssl/certs/java/cacerts -storepass changeit -noprompt -trustcacerts -importcert -alias EnterpriseRootCA -file /opt/EnterpriseRootCA.crt
   ```

1. Node.js applications must set the `NODE_EXTRA_CA_CERTS` environment variable:

   ```xml
   ADD EnterpriseRootCA.crt /opt/
   ENV NODE_EXTRA_CA_CERTS="/opt/EnterpriseRootCA.crt"
   ```

1. For Python, or other languages relying on the system CA store, on Debian or Ubuntu images, add the following environment variables:

   ```xml
   ADD EnterpriseRootCA.crt /usr/local/share/ca-certificates/
   RUN /usr/sbin/update-ca-certificates
   ```

1. For Python, or other languages relying on the system CA store, on CentOS or Fedora based images, add the following environment variables:
   ```xml
   ADD EnterpriseRootCA.crt /etc/pki/ca-trust/source/anchors/
   RUN /usr/bin/update-ca-trust
   ``` 
### How to avoid unexpected behavior when images change

When your application is restarted or scaled out, the latest image will always be pulled. If the image has been changed, the newly started application instances will use the new image while the old instances will continue to use the old image. This may lead to unexpected application behavior. To avoid this, don't use the `latest` tag or overwrite an image without a tag change.

### How to avoid not being able to connect to the container registry in a VNet

If you deployed the instance to a VNet, make sure you allow the network traffic to your container registry in the NSG or Azure Firewall (if used). For more information, see [Customer responsibilities for running in VNet](/azure/spring-cloud/vnet-customer-responsibilities) to add the needed security rules.

### How to install an APM into the image manually

The installation steps vary on different APMs and languages. The following steps are for `New Relic` with Java applications. You must modify the `Dockerfile` using the following steps:

1. Download and install the agent file into the image by adding the following to the `Dockerfile`: `ADD newrelic-agent.jar /opt/agents/newrelic/java/newrelic-agent.jar`

1. Add the environment variables required by the APM:

    ```xml
    ENV NEW_RELIC_APP_NAME=appName
    ENV NEW_RELIC_LICENSE_KEY=newRelicLicenseKey
    ```

1. Modify the image entry point by adding: `java -javaagent:/opt/agents/newrelic/java/newrelic-agent.jar`

For more information on how to install the agents for the Java apps, please see the following articles:

* [New Relic Monitor](/azure/spring-cloud/how-to-new-relic-monitor)
* [Dynatrace One Agent Monitor](/azure/spring-cloud/how-to-dynatrace-one-agent-monitor)
* [App Dynamics Java Agent Monitor](/azure/spring-cloud/how-to-appdynamics-java-agent-monitor)

To install the agents for other languages, refer to the official documentation for the other agents:

New Relic:
* Python: https://docs.newrelic.com/docs/apm/agents/python-agent/installation/standard-python-agent-install/
* Node.js: https://docs.newrelic.com/docs/apm/agents/nodejs-agent/installation-configuration/install-nodejs-agent/

Dynatrace:
* Python: https://www.dynatrace.com/support/help/extend-dynatrace/opentelemetry/opentelemetry-traces/opentelemetry-ingest/opent-python
* Node.js: https://www.dynatrace.com/support/help/extend-dynatrace/opentelemetry/opentelemetry-traces/opentelemetry-ingest/opent-nodejs

AppDynamics:
* Python: https://docs.appdynamics.com/4.5.x/en/application-monitoring/install-app-server-agents/python-agent/install-the-python-agent
* Node.js: https://docs.appdynamics.com/4.5.x/en/application-monitoring/install-app-server-agents/node-js-agent/install-the-node-js-agent#InstalltheNode.jsAgent-install_nodejsInstallingtheNode.jsAgent

### How to view the container logs

To view the console logs of your container application, the following CLI command can be used:

```azurecli
az spring-cloud app logs \
   -name <AppName> \
   -group <ResoureGroup> \
   -service <ServiceName> \
   -instance <AppInstanceName>
```

To view the container events logs from the Azure Monitor:

```xml
AppPlatformContainerEventLogs | where App == "hw-20220317-1b"
```

:::image type="content" source="media/how-to-deploy-with-custom-container-image/container-event-logs.png" alt-text="Screenshot of the container events log.":::

### How to scan your image for vulnerabilities

It is recommended that you use Microsoft Defender for Cloud with ACR to prevent your images from being vulnerable. For more information, see [Defender for Cloud](/azure/defender-for-cloud/defender-for-containers-introduction?tabs=defender-for-container-arch-aks#scanning-images-in-acr-registries)

### How to switch between JAR deployment and container deployment

The deployment type can be switched directly by redeploying using the following command:

```azurecli
az spring-cloud app deploy \ 
   -name <MyApp> \
   -service <MyCluster> \
   -group <MyResourceGroup> \
   --container-image contoso/your-app:v1
```

### How to create another deployment with an existing JAR deployment

You can create another deployment using an existing JAR deployment using the following command:

```azurecli
az spring-cloud app deployment create \
   --app <MyApp> \
   -service <MyCluster>
   -group <MyResourceGroup>
   -name <greenDeployment> \
   --container-image contoso/your-app:v1
```

> [!NOTE]
> Automating deployments using Azure Pipelines Tasks or GitHub Actions are not currently supported.

## Next Steps

* [How to capture dumps](/azure/spring-cloud/how-to-capture-dumps)
