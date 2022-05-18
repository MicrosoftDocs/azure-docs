---
title: Deploy a Java application with Red Hat JBoss Enterprise Application Platform (JBoss EAP) on an Azure Red Hat OpenShift 4 cluster
description: Deploy a Java application with Red Hat JBoss Enterprise Application Platform on an Azure Red Hat OpenShift 4 cluster.
author: yersan
ms.author: edburns
ms.date: 01/11/2022
ms.topic: article
ms.service: azure-redhat-openshift
keywords: java, jakartaee, microprofile, EAP, JBoss EAP, ARO, OpenShift, JBoss Enterprise Application Platform
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-liberty, devx-track-javaee-liberty-aro
---

# Deploy a Java application with Red Hat JBoss Enterprise Application Platform on an Azure Red Hat OpenShift 4 cluster

This article shows you how to deploy a Red Hat JBoss Enterprise Application Platform (JBoss EAP) app to an Azure Red Hat OpenShift (ARO) 4 cluster. The application is a Jakarta EE application that uses Microsoft SQL server database. The app is deployed using [JBoss EAP Helm Charts](https://jbossas.github.io/eap-charts).

The guide takes a traditional Jakarta EE application and walks you through the process of migrating it to a container orchestrator such as Azure Red Hat OpenShift. First, it describes how you can package your application as a [Bootable JAR](https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/7.4/html/using_jboss_eap_xp_3.0.0/the-bootable-jar_default) to run it locally. Finally, it shows you how you can deploy on OpenShift with three replicas of the JBoss EAP application by using Helm Charts.

The application is a stateful application that stores information in an HTTP Session. It makes use of the JBoss EAP clustering capabilities and uses the following Jakarta EE 8 and MicroProfile 4.0 technologies:

* Jakarta Server Faces
* Jakarta Enterprise Beans
* Jakarta Persistence
* MicroProfile Health

> [!IMPORTANT]
> This article assumes you have access to a Microsoft SQL Server instance accessible to your ARO cluster. Please review the [support policy for SQL Server Containers](https://support.microsoft.com/help/4047326/support-policy-for-microsoft-sql-server) to ensure that you are running on a supported configuration.

> [!IMPORTANT]
> This article deploys an application by using JBoss EAP Helm Charts. At the time of writing, this feature is still offered as a [Technology Preview](https://access.redhat.com/articles/6290611). Before choosing to deploy applications with JBoss EAP Helm Charts on production environments, ensure that this feature is a supported feature for your JBoss EAP/XP product version.

[!INCLUDE [aro-support](includes/aro-support.md)]

## Prerequisites

[!INCLUDE [aro-quota](includes/aro-quota.md)]

1. Prepare a local machine with a Unix-like operating system that is supported by the various products installed.
1. Install a Java SE implementation (for example, [Oracle JDK 11](https://www.oracle.com/java/technologies/downloads/#java11)).
1. Install [Maven](https://maven.apache.org/download.cgi) 3.6.3 or higher.
1. Install [Azure CLI](/cli/azure/install-azure-cli) 2.29.2 or later.
1. Clone the code for this demo application (todo-list) to your local system. The demo application is at [GitHub](https://github.com/Azure-Samples/jboss-on-aro-jakartaee).
1. Follow the instructions in [Create an Azure Red Hat OpenShift 4 cluster](./tutorial-create-cluster.md).

   Though the "Get a Red Hat pull secret" step is labeled as optional, **it is required for this article**.  The pull secret enables your ARO cluster to find the JBoss EAP application images.

   If you plan to run memory-intensive applications on the cluster, specify the proper virtual machine size for the worker nodes using the `--worker-vm-size` parameter. For more information, see:

   * [Azure CLI to create a cluster](/cli/azure/aro#az-aro-create)
   * [Supported virtual machine sizes for memory optimized](./support-policies-v4.md#memory-optimized)

1. Connect to the cluster by following the steps in [Connect to an Azure Red Hat OpenShift 4 cluster](./tutorial-connect-cluster.md).
   * Follow the steps in "Install the OpenShift CLI"
   * Connect to an Azure Red Hat OpenShift cluster using the OpenShift CLI with the user `kubeadmin`

1. Execute the following command to create the OpenShift project for this demo application:

    ```bash
    $ oc new-project eap-demo
    Now using project "eap-demo" on server "https://api.zhbq0jig.northeurope.aroapp.io:6443".

    You can add applications to this project with the 'new-app' command. For example, try:

    oc new-app rails-postgresql-example

    to build a new example application in Ruby. Or use kubectl to deploy a simple Kubernetes application:

    kubectl create deployment hello-node --image=k8s.gcr.io/serve_hostname
    ```

1. Execute the following command to add the view role to the default service account. This role is needed so the application can discover other pods and form a cluster with them:

    ```bash
    $ oc policy add-role-to-user view system:serviceaccount:$(oc project -q):default -n $(oc project -q)
    clusterrole.rbac.authorization.k8s.io/view added: "system:serviceaccount:eap-demo:default"
    ```

## Prepare the application

At this stage, you have cloned the `Todo-list` demo application and your local repository is on the `main` branch. The demo application is a simple Jakarta EE 8 application that creates, reads, updates, and deletes records on a Microsoft SQL Server. This application can be deployed as it is on a JBoss EAP server installed in your local machine. You just need to configure the server with the required database driver and data source. You also need a database server accessible from your local environment.

However, when you are targeting OpenShift, you might want to trim the capabilities of your JBoss EAP server. For example, to reduce the security exposure of the provisioned server and reduce the overall footprint. You might also want to include some MicroProfile specs to make your application more suitable for running on an OpenShift environment. When using JBoss EAP, one way to accomplish this is by packaging your application and your server in a single deployment unit known as a Bootable JAR. Let's do that by adding the required changes to our demo application.

Navigate to your demo application local repository and change the branch to `bootable-jar`:

```bash
$ git checkout bootable-jar
Switched to branch 'bootable-jar'
$
```

Let's do a quick review about what we have changed:

* We have added the `wildfly-jar-maven` plugin to provision the server and the application in a single executable JAR file. The OpenShift deployment unit is our server with our application.
* On the maven plugin, we have specified a set of Galleon layers. This configuration allows us to trim the server capabilities to only what we need. For complete documentation on Galleon, see [the WildFly documentation](https://docs.wildfly.org/galleon/).
* Our application uses Jakarta Faces with Ajax requests, which means there will be information stored in the HTTP Session. We don't want to lose such information if a pod is removed. We could save this information on the client and send it back on each request. However, there are cases where you may decide not to distribute certain information to the clients. For this demo, we have chosen to replicate the session across all pod replicas. To do it, we have added `<distributable />` to the `web.xml`. That, together with the server clustering capabilities will make the HTTP Session distributable across all pods.
* We have added two MicroProfile Health Checks that allow identifying when the application is live and ready to receive requests.

## Run the application locally

Before deploying the application on OpenShift, we are going to run it locally to verify how it works. The following steps assume you have a Microsoft SQL Server running and available from your local environment. This database must be created using the following information:

* Database name: `todos_db`
* SA password: `Passw0rd!`

To create the database, follow the steps in [Quickstart: Create an Azure SQL Database single database](/azure/azure-sql/database/single-database-create-quickstart?tabs=azure-portal), but use the following substitutions.

* For **Database name** use `todos_db`.
* For **Password** use `Passw0rd!`.

On the **Additional settings** page, you don't have to choose the option to pre-populate the database with sample data, but there is no harm in doing so.

Once the database has been created with the above database name and password, obtain the value for the `MSSQLSERVER_HOST` from the overview page for the database resource in the portal. Hover the mouse over the value of the **Server name** field and select the copy icon that appears beside the value. Save this aside for use later.

Follow the next steps to build and run the application locally.

1. Build the Bootable JAR. When we are building the Bootable JAR, we need to specify the database driver version we want to use:

    ```bash
    $ MSSQLSERVER_DRIVER_VERSION=7.4.1.jre11 \
    mvn clean package
    ```

1. Launch the Bootable JAR by using the following command. When we are launching the application, we need to pass the required environment variables to configure the data source:

    ```bash
    $ MSSQLSERVER_USER=SA \
    MSSQLSERVER_PASSWORD=Passw0rd! \
    MSSQLSERVER_JNDI=java:/comp/env/jdbc/mssqlds \
    MSSQLSERVER_DATABASE=todos_db \
    MSSQLSERVER_HOST=<server name saved aside earlier> \
    MSSQLSERVER_PORT=1433 \
    mvn wildfly-jar:run
    ```

    Check the [Galleon Feature Pack for integrating datasources](https://github.com/jbossas/eap-datasources-galleon-pack/blob/main/doc/mssqlserver/README.md) documentation to get a complete list of available environment variables. For details on the concept of feature-pack, see [the WildFly documentation](https://docs.wildfly.org/galleon/#_feature_packs).

1. (Optional) If you want to verify the clustering capabilities, you can also launch more instances of the same application by passing to the Bootable JAR the `jboss.node.name` argument and, to avoid conflicts with the port numbers, shifting the port numbers by using `jboss.socket.binding.port-offset`. For example, to launch a second instance that will represent a new pod on OpenShift, you can execute the following command in a new terminal window:

    ```bash  
    $ MSSQLSERVER_USER=SA \
    MSSQLSERVER_PASSWORD=Passw0rd! \
    MSSQLSERVER_JNDI=java:/comp/env/jdbc/mssqlds \
    MSSQLSERVER_DATABASE=todos_db \
    MSSQLSERVER_HOST=<server name saved aside earlier> \
    MSSQLSERVER_PORT=1433 \
    mvn wildfly-jar:run -Dwildfly.bootable.arguments="-Djboss.node.name=node2 -Djboss.socket.binding.port-offset=1000"
    ```

    If your cluster is working, you will see on the server console log a trace similar to the following one:

    ```bash
    INFO  [org.infinispan.CLUSTER] (thread-6,ejb,node) ISPN000094: Received new cluster view for channel ejb
    ```

    > [!NOTE]
    > By default the Bootable JAR configures the JGroups subsystem to use the UDP protocol and sends messages to discover other cluster members to the 230.0.0.4 multicast address. To properly verify the clustering capabilities on your local machine, your Operating System should be capable of sending and receiving multicast datagrams and route them to the 230.0.0.4 IP through your ethernet interface. If you see warnings related to the cluster on the server logs, check your network configuration and verify whether is working with the multicast address.

1. Open `http://localhost:8080/` in your browser to visit the application home page. If you have created more instances, you can access them by shifting the port number, for example `http://localhost:9080/`. The application will look similar to the following image:

    :::image type="content" source="media/howto-deploy-java-enterprise-application-platform-app/todo-demo-application.png" alt-text="Screenshot of ToDo EAP demo Application.":::

1. Check the application health endpoints (live and ready). These endpoints will be used by OpenShift to verify when your pod is live and ready to receive user requests:

   ```bash  
    $ curl http://localhost:9990/health/live
    {"status":"UP","checks":[{"name":"SuccessfulCheck","status":"UP"}]}

    $ curl http://localhost:9990/health/ready
    {"status":"UP","checks":[{"name":"deployments-status","status":"UP","data":{"todo-list.war":"OK"}},{"name":"server-state","status":"UP","data":{"value":"running"}},{"name":"boot-errors","status":"UP"},{"name":"DBConnectionHealthCheck","status":"UP"}]}
    ```

1. Press **Control-C** to stop the application.

## Deploy to OpenShift

To deploy the application, we are going to use the JBoss EAP Helm Charts already available in ARO. We also need to supply the desired configuration, for example, the database user, the database password, the driver version we want to use, and the connection information used by the data source. The following steps assume you have a MicrosoftSQL database server running and exposed by an OpenShift service, and you have stored the database user name, password and database name in an [OpenShift Secret object](https://docs.openshift.com/container-platform/4.8/nodes/pods/nodes-pods-secrets.html#nodes-pods-secrets-about_nodes-pods-secrets) under the following name `mssqlserver-secret`.

> [!NOTE]
> You can also use the [JBoss EAP Operator](https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/7.3/html/getting_started_with_jboss_eap_for_openshift_container_platform/eap-operator-for-automating-application-deployment-on-openshift_default) to deploy this example, however, notice that the JBoss EAP Operator will deploy the application as `StatefulSets`. Use the JBoss EAP Operator if your application requires one or more one of the following.
>
> * Stable, unique network identifiers.
> * Stable, persistent storage.
> * Ordered, graceful deployment and scaling.
> * Ordered, automated rolling updates.
> * Transaction recovery facility when a pod is scaled down or crashes.

Navigate to your demo application local repository and change the current branch to `bootable-jar-openshift`:

```bash
$ git checkout bootable-jar-openshift
Switched to branch 'bootable-jar-openshift'
$
```

Let's do a quick review about what we have changed:

- We have added a new maven profile named `bootable-jar-openshift` that prepares the Bootable JAR with a specific configuration for running the server on the cloud, for example, it enables the JGroups subsystem to use TCP requests to discover other pods by using the KUBE_PING protocol.
- We have added a set of configuration files in the _jboss-on-aro-jakartaee/deployment_ directory. In this directory, you will find the configuration files to deploy the application.

### Deploy the application on OpenShift

We can deploy the demo application via JBoss EAP Helm Charts. The Helm Chart application configuration file is available at _deployment/application/todo-list-helm-chart.yaml_. You could deploy this file via the command line; however, to do so you would need to have Helm Charts installed on your local machine. Instead of using the command line, the next steps explain how you can deploy this Helm Chart by using the OpenShift web console.

Before deploying the application, let's create the expected Secret object that will hold specific application configuration. The Helm Chart will get the database user, password and name from a secret named `mssqlserver-secret`, and the driver version, the datasource JNDI name and the cluster password from the following Secret:

1. Execute the following to create the OpenShift secret object that will hold the application configuration:

    ```bash
    $ oc create secret generic todo-list-secret \
    --from-literal app-driver-version=7.4.1.jre11 \
    --from-literal app-ds-jndi=java:/comp/env/jdbc/mssqlds \
    --from-literal app-cluster-password=mut2UTG6gDwNDcVW
    ```

    > [!NOTE]
    > You decide the cluster password you want to use, the pods that want to join to your cluster need such a password. Using a password prevents that any pods that are not under your control can join to your JBoss EAP cluster.

    > [!NOTE]
    > You may have noticed from the above Secret that we are not supplying the database Hostname and Port. That's not necessary. If you take a closer look at the Helm Chart application file, you will see that the database Hostname and Port are passed by using the following notations \$(MSSQLSERVER_SERVICE_HOST) and \$(MSSQLSERVER_SERVICE_PORT). This is a standard OpenShift notation that will ensure the application variables (MSSQLSERVER_HOST, MSSQLSERVER_PORT) get assigned to the values of the pod environment variables (MSSQLSERVER_SERVICE_HOST, MSSQLSERVER_SERVICE_PORT) that are available at runtime. These pod environment variables are passed by OpenShift when the pod is launched. These variables are available to any pod when you create an OpenShift service exposing the database server.

2. Open the OpenShift console and navigate to the developer view (in the **</> Developer** perspective in the left hand menu)

    :::image type="content" source="media/howto-deploy-java-enterprise-application-platform-app/console-developer-view.png" alt-text="Screenshot of OpenShift console developer view.":::

3. Once you are in the **</> Developer** perspective, ensure you have selected the **eap-demo** project at the **Project** combo box.

    :::image type="content" source="media/howto-deploy-java-enterprise-application-platform-app/console-project-combo-box.png" alt-text="Screenshot of OpenShift console project combo box.":::

4. Go to **+Add**, then select **Helm Chart**. You will arrive at the Helm Chart catalog available on your ARO cluster. Write **eap** on the filter input box to filter all the Helm Charts and get the EAP ones. At this stage, you should see two options:

    :::image type="content" source="media/howto-deploy-java-enterprise-application-platform-app/console-eap-helm-charts.png" alt-text="Screenshot of OpenShift console EAP Helm Charts.":::

5. Since our application uses MicroProfile capabilities, we are going to select for this demo the Helm Chart for EAP XP (at the time of this writing, the exact version of the Helm Chart is **EAP Xp3 v1.0.0**). The `Xp3` stands for Expansion Pack version 3.0.0. With the JBoss Enterprise Application Platform expansion pack, developers can use Eclipse MicroProfile application programming interfaces (APIs) to build and deploy microservices-based applications.

6. Open the **EAP Xp** Helm Chart, and then select **Install Helm Chart**.

At this point, we need to configure the chart to be able to build and deploy the application:

1. Change the name of the release to **eap-todo-list-demo**.
1. We can configure the Helm Chart either using a **Form View** or a **YAML View**. Select **YAML View** in the **Configure via** box.
1. Then, change the YAML content to configure the Helm Chart by copying the content of the Helm Chart file available at _deployment/application/todo-list-helm-chart.yaml_ instead of the existing content:

   :::image type="content" source="media/howto-deploy-java-enterprise-application-platform-app/console-eap-helm-charts-yaml-content-inline.png" alt-text="OpenShift console EAP Helm Chart YAML content" lightbox="media/howto-deploy-java-enterprise-application-platform-app/console-eap-helm-charts-yaml-content-expanded.png":::

1. Finally, select **Install** to start the application deployment. This will open the **Topology** view with a graphical representation of the Helm release (named **eap-todo-list-demo**) and its associated resources.

    :::image type="content" source="media/howto-deploy-java-enterprise-application-platform-app/console-topology.png" alt-text="Screenshot of OpenShift console topology.":::

    The Helm Release (abbreviated **HR**) is named **eap-todo-list-demo**. It includes a Deployment resource (abbreviated **D**) also named **eap-todo-list-demo**.

1. When the build is finished (the bottom-left icon will display a green check) and the application is deployed (the circle outline is in dark blue), you can go to application the URL (using the top-right icon) from the route associated to the deployment.

    :::image type="content" source="media/howto-deploy-java-enterprise-application-platform-app/console-open-application.png" alt-text="Screenshot of OpenShift console open application.":::

1. The application is opened in your browser looking similar to the following image ready to be used:

    :::image type="content" source="media/howto-deploy-java-enterprise-application-platform-app/application-running-openshift.png" alt-text="Screenshot of OpenShift application running.":::

1. The application shows you the name of the pod which has served the information. To verify the clustering capabilities, you could add some Todos. Then delete the pod with the name indicated in the **Server Host Name** field that appears on the application `(oc delete pod <pod name>)`, and once deleted, create a new Todo on the same application window. You will see that the new Todo is added via an Ajax request and the **Server Host Name** field now shows a different name. Behind the scenes, the new request has been dispatched by the OpenShift load balancer and delivered to an available pod. The Jakarta Faces view has been restored from the HTTP Session copy stored in the pod which is now processing the request. Indeed you will see that the **Session ID** field has not changed. If the session were not replicated across your pods, you would get a Jakarta Faces ViewExpiredException, and your application won't work as expected.

## Clean up resources

### Delete the application

If you only want to delete your application, you can open the OpenShift console and, at the developer view, navigate to the **Helm** menu option. On this menu, you will see all the Helm Chart releases installed on your cluster.

   :::image type="content" source="media/howto-deploy-java-enterprise-application-platform-app/console-uninstall-application-inline.png" alt-text="OpenShift uninstall application" lightbox="media/howto-deploy-java-enterprise-application-platform-app/console-uninstall-application-expanded.png":::

Locate the **eap-todo-list-demo** Helm Chart and at the end of the row, select the tree vertical dots to open the action contextual menu entry.

Select **Uninstall Helm Release** to remove the application. Notice that the secret object used to supply the application configuration is not part of the chart. You need to remove it separately if you no longer need it.

Execute the following command if you want to delete the secret that holds the application configuration:

```bash
$ oc delete secrets/todo-list-secret
secret "todo-list-secret" deleted
```

### Delete the OpenShift project

You can also delete all the configuration created for this demo by deleting the `eap-demo` project. To do so, execute the following:

```bash
$ oc delete project eap-demo
project.project.openshift.io "eap-demo" deleted
```

### Delete the ARO cluster

Delete the ARO cluster by following the steps in [Tutorial: Delete an Azure Red Hat OpenShift 4 cluster](./tutorial-delete-cluster.md)

## Next steps

In this guide, you learned how to:
> [!div class="checklist"]
>
> * Prepare an JBoss EAP application for OpenShift.
> * Run it locally together with a containerized Microsoft SQL Server.
> * Deploy a Microsoft SQL Server on an ARO 4 by using the OpenShift CLI.
> * Deploy the application on an ARO 4 by using JBoss Helm Charts and OpenShift Web Console.

You can learn more from references used in this guide:

* [Red Hat JBoss Enterprise Application Platform](https://www.redhat.com/en/technologies/jboss-middleware/application-platform)
* [Azure Red Hat OpenShift](https://azure.microsoft.com/services/openshift/)
* [JBoss EAP Helm Charts](https://jbossas.github.io/eap-charts/)
* [JBoss EAP Bootable JAR](https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/7.4/html-single/using_jboss_eap_xp_3.0.0/index#the-bootable-jar_default)