---
title: Run an Apache Spark job with Azure Container Service (AKS)
description: Use Azure Container Service (AKS) to run an Apache Spark job
services: container-service
author: lenadroid
manager: listonb

ms.service: container-service
ms.topic: article
ms.date: 03/08/2018
ms.author: alehall
ms.custom: mvc
---

# Running Apache Spark jobs on AKS

[Apache Spark][apache-spark] is a fast and general engine for large-scale data processing. As of the [latest release][spark-latest-release], Apache Spark can run on clusters managed by Kubernetes. Azure Container Service (AKS) manages hosted Kubernetes environments, and this document details preparing and running an Apache Spark job with Azure Container Service (AKS) cluster.

## Prerequisites

In order to complete the steps within this article, you need the following.

* Basic understanding of Kubernetes and [Apache Spark][spark-quickstart].
* An Azure Container Service (AKS) cluster and AKS credentials configured on your development system. Get started [here][aks-quickstart].
* [Docker Hub][docker-hub] account, or existing [Azure Container Registry][acr-create].
* Azure CLI [installed][azure-cli] on your development system.
* [JDK 8][java-install] installed on your system.
* SBT ([Scala Build Tool][sbt-install]) installed on your system.
* Git command-line tools installed on your system.

## Get Apache Spark

Clone the Spark project repository to your development system.

```console
git clone https://github.com/apache/spark
```

Change into the directory of the cloned repository, and save the path to the Spark source to a variable.

```console
cd spark
sparkdir=$(pwd)
```

## Deploy Spark container image

Kubernetes requires users to supply images that can be deployed into containers within pods. To prepare the Spark image, build Spark source code with Kubernetes support.

```console
./build/mvn -Pkubernetes -DskipTests clean package
```

Build a container image.

```console
./bin/docker-image-tool.sh -r <your container repository name> -t <tag> build
```

Publish the container image.

```console
./bin/docker-image-tool.sh -r <your container repository name> -t <tag> push
```

Parameter `<your container repository name>` is a name of existing Docker Hub account or Azure Container Registry. Parameter `<tag>` is your choice for a name of the tag the Spark container image should be published with.

For example, if the Docker Hub was used as a container registry with account name `lenadroid`, the image would be published in a repository called `spark` under the specified tag.

![Container image](media/aks-spark-job/container-image.png)

Similarly, in case of Azure Container Registry with the Login Server name `lenadroid.azurecr.io`, the image would be published in a repository called `spark` under the given tag.

![ACR image](media/aks-spark-job/acr-image.png)

When using Azure Container Registry (ACR) with your Azure Container Service cluster, follow these [steps][acr-aks] to properly assign read access to the ACR resource.

## Prepare a Spark job

Next step is preparing a Spark job to run on a Kubernetes cluster. A `jar` file with a Spark job is one of the inputs to `spark-submit` command. The `jar` should be either accessible through a public URL, or pre-packaged within a container image. Feel free to use your own `jar` for a Spark job, or create a new one following the instructions.

Navigate to a directory where you would like to create the project for a Spark job.

```console
cd /myprojects
```

Create a new Scala project from a template.

```console
sbt new sbt/scala-seed.g8
```

The command will prompt for a project name, enter `SparkPi`.

Output:

```console
A minimal Scala project.

name [Scala Seed Project]: SparkPi

Template applied in ./sparkpi
```

Navigate to the newly created project directory.

```console
cd sparkpi
```

Run the following code to add an SBT plugin that allows packaging the project as a `jar` file.

```console
touch project/assembly.sbt
echo 'addSbtPlugin("com.eed3si9n" % "sbt-assembly" % "0.14.6")' >> project/assembly.sbt
```

Run the command to copy the code file to calculate Pi number from examples directory into the newly created project, and add necessary dependencies to `build.sbt`.

```console
examplesdir="src/main/scala/org/apache/spark/examples"
mkdir -p $examplesdir
cp $sparkdir/examples/$examplesdir/SparkPi.scala $examplesdir/SparkPi.scala

cat <<EOT >> build.sbt
// https://mvnrepository.com/artifact/org.apache.spark/spark-sql
libraryDependencies += "org.apache.spark" %% "spark-sql" % "2.3.0" % "provided"
EOT

sed -ie 's/scalaVersion.*/scalaVersion := "2.11.11",/' build.sbt
sed -ie 's/name.*/name := "SparkPi",/' build.sbt
```

To package the project into a `jar`, run the following command.

```console
sbt assembly
```

After successful packaging, you should see output similar to the following.

```console
[info] Packaging /Users/me/myprojects/sparkpi/target/scala-2.11/SparkPi-assembly-0.1.0-SNAPSHOT.jar ...
[info] Done packaging.
[success] Total time: 10 s, completed Mar 6, 2018 11:07:54 AM
```

Upload the `jar` file to a remotely accessible location. For example, you can use Azure Storage Account [instructions][storage-account] to create a storage account container and upload the `jar` file.

```console
container_name=jars
blob_name=SparkPi-assembly-0.1.0-SNAPSHOT.jar
file_to_upload=target/scala-2.11/SparkPi-assembly-0.1.0-SNAPSHOT.jar
destination_file=SparkPi-assembly-0.1.0-SNAPSHOT.jar

echo "Creating the container..."
az storage container create --name $container_name
az storage container set-permission --name $container_name --public-access blob

echo "Uploading the file..."
az storage blob upload --container-name $container_name --file $file_to_upload --name $blob_name

jarUrl=$(az storage blob url --container-name $container_name --name $blob_name | tr -d '"')
```

Variable `jarUrl` now contains the publicly accessible path to the `jar` file with the Spark job.

## Submit a Spark job

Create a Kubernetes cluster, or use an existing one. Spark is generally used for large-scale data processing, so Spark pods have minimal resources requirements. For instance, Spark driver pod and each executor pod require one Azure core by default (details are [here][spark-conf]).

For this example, a three node cluster AKS is used with a VM size `Standard_D3_v2`.

```console
az group create --name <resource-group-name> --location <resource-group-location>
az aks create --resource-group <resource-group-name> --name <cluster-name> --node-vm-size Standard_D3_v2
```

Discover the URL where Kubernetes API server is running at.

```console
kubectl cluster-info
```

Output:

```console
Kubernetes master is running at https://<your api server>:443
```

Navigate back to the root of Spark repository.

```console
cd $sparkdir
```

Submit the job using `spark-submit`. Replacing `<k8s-apiserver-host>` and `<k8s-apiserver-port>` with the appropriate values according to your AKS master, `<spark-image>` with the corresponding container image in format of `<your container repository name>/spark:<tag>`.

```console
$ ./bin/spark-submit \
    --master k8s://https://<k8s-apiserver-host>:<k8s-apiserver-port> \
    --deploy-mode cluster \
    --name spark-pi \
    --class org.apache.spark.examples.SparkPi \
    --conf spark.executor.instances=3 \
    --conf spark.kubernetes.container.image=<spark-image> \
    $jarUrl
```

This operation should start the Spark job using Kubernetes scheduler and show the progress of job stages.

Output:

```console
2018-03-06 16:28:22 INFO  LoggingPodStatusWatcherImpl:54 - State changed, new state:
	 pod name: spark-pi-2232778d0f663768ab27edc35cb73040-driver
	 namespace: default
	 labels: spark-app-selector -> spark-275914e628234c3aadf85b1de472c4f6, spark-role -> driver
	 pod uid: 711a0211-219e-11e8-9a3e-0a58ac1f043c
	 creation time: 2018-03-07T00:28:22Z
	 service account name: default
	 volumes: spark-init-properties, download-jars-volume, download-files-volume, default-token-rzdpr
	 node name: N/A
	 start time: N/A
	 container images: N/A
	 phase: Pending
	 status: []

... truncated ...

2018-03-06 16:28:22 INFO  Client:54 - Waiting for application spark-pi to finish...

... truncated ...

2018-03-06 16:28:30 INFO  LoggingPodStatusWatcherImpl:54 - State changed, new state:
	 pod name: spark-pi-2232778d0f663768ab27edc35cb73040-driver
	 namespace: default
	 labels: spark-app-selector -> spark-275914e628234c3aadf85b1de472c4f6, spark-role -> driver
	 pod uid: 711a0211-219e-11e8-9a3e-0a58ac1f043c
	 creation time: 2018-03-07T00:28:22Z
	 service account name: default
	 volumes: spark-init-properties, download-jars-volume, download-files-volume, default-token-rzdpr
	 node name: aks-agentpool-16588529-2
	 start time: 2018-03-07T00:28:22Z
	 container images: lenadroid/spark:spark-2.3.0
	 phase: Running
	 status: [ContainerStatus(containerID=docker://f6cb6b359b022002799cd73fe1dfcf14574d20908372c8771bc1aec1406d5d43, image=lenadroid/spark:spark-2.3.0, imageID=docker-pullable://lenadroid/spark@sha256:9426e915efb7b62a4788588feac06b4217cb8d23bcd5a8fabb5f172a2e428a83, lastState=ContainerState(running=null, terminated=null, waiting=null, additionalProperties={}), name=spark-kubernetes-driver, ready=true, restartCount=0, state=ContainerState(running=ContainerStateRunning(startedAt=Time(time=2018-03-07T00:28:29Z, additionalProperties={}), additionalProperties={}), terminated=null, waiting=null, additionalProperties={}), additionalProperties={})]
2018-03-06 16:28:48 INFO  LoggingPodStatusWatcherImpl:54 - State changed, new state:
	 pod name: spark-pi-2232778d0f663768ab27edc35cb73040-driver
	 namespace: default
	 labels: spark-app-selector -> spark-275914e628234c3aadf85b1de472c4f6, spark-role -> driver
	 pod uid: 711a0211-219e-11e8-9a3e-0a58ac1f043c
	 creation time: 2018-03-07T00:28:22Z
	 service account name: default
	 volumes: spark-init-properties, download-jars-volume, download-files-volume, default-token-rzdpr
	 node name: aks-agentpool-16588529-2
	 start time: 2018-03-07T00:28:22Z
	 container images: lenadroid/spark:spark-2.3.0
	 phase: Succeeded
	 status: [ContainerStatus(containerID=docker://f6cb6b359b022002799cd73fe1dfcf14574d20908372c8771bc1aec1406d5d43, image=lenadroid/spark:spark-2.3.0, imageID=docker-pullable://lenadroid/spark@sha256:9426e915efb7b62a4788588feac06b4217cb8d23bcd5a8fabb5f172a2e428a83, lastState=ContainerState(running=null, terminated=null, waiting=null, additionalProperties={}), name=spark-kubernetes-driver, ready=false, restartCount=0, state=ContainerState(running=null, terminated=ContainerStateTerminated(containerID=docker://f6cb6b359b022002799cd73fe1dfcf14574d20908372c8771bc1aec1406d5d43, exitCode=0, finishedAt=Time(time=2018-03-07T00:28:47Z, additionalProperties={}), message=null, reason=Completed, signal=null, startedAt=Time(time=2018-03-07T00:28:29Z, additionalProperties={}), additionalProperties={}), waiting=null, additionalProperties={}), additionalProperties={})]
2018-03-06 16:28:48 INFO  LoggingPodStatusWatcherImpl:54 - Container final statuses:
	 Container name: spark-kubernetes-driver
	 Container image: lenadroid/spark:spark-2.3.0
	 Container state: Terminated
	 Exit code: 0
2018-03-06 16:28:48 INFO  Client:54 - Application spark-pi finished.
2018-03-06 16:28:48 INFO  ShutdownHookManager:54 - Shutdown hook called
2018-03-06 16:28:48 INFO  ShutdownHookManager:54 - Deleting directory /private/var/folders/tx/y11c6rsn6rg643s8b5jlcvnc0000gn/T/spark-4d9948ad-8a35-46e8-a273-51bef179a9ce
```

While the job is running, it is possible to see Spark driver pod and executor pods running.

```console
$ kubectl get pods
NAME                                               READY     STATUS     RESTARTS   AGE
spark-pi-2232778d0f663768ab27edc35cb73040-driver   0/1       Init:0/1   0          4s

$ kubectl get pods
NAME                                               READY     STATUS            RESTARTS   AGE
spark-pi-2232778d0f663768ab27edc35cb73040-driver   0/1       PodInitializing   0          8s

$ kubectl get pods
NAME                                               READY     STATUS    RESTARTS   AGE
spark-pi-2232778d0f663768ab27edc35cb73040-driver   1/1       Running   0          9s

$ kubectl get pods
NAME                                               READY     STATUS    RESTARTS   AGE
spark-pi-2232778d0f663768ab27edc35cb73040-driver   1/1       Running   0          11s

$ kubectl get pods
NAME                                               READY     STATUS     RESTARTS   AGE
spark-pi-2232778d0f663768ab27edc35cb73040-driver   1/1       Running    0          12s
spark-pi-2232778d0f663768ab27edc35cb73040-exec-1   0/1       Init:0/1   0          0s
spark-pi-2232778d0f663768ab27edc35cb73040-exec-2   0/1       Init:0/1   0          0s
spark-pi-2232778d0f663768ab27edc35cb73040-exec-3   0/1       Init:0/1   0          0s

$ kubectl get pods
NAME                                               READY     STATUS     RESTARTS   AGE
spark-pi-2232778d0f663768ab27edc35cb73040-driver   1/1       Running    0          16s
spark-pi-2232778d0f663768ab27edc35cb73040-exec-1   0/1       Init:0/1   0          4s
spark-pi-2232778d0f663768ab27edc35cb73040-exec-2   0/1       Init:0/1   0          4s
spark-pi-2232778d0f663768ab27edc35cb73040-exec-3   0/1       Init:0/1   0          4s

$ kubectl get pods
NAME                                               READY     STATUS            RESTARTS   AGE
spark-pi-2232778d0f663768ab27edc35cb73040-driver   1/1       Running           0          19s
spark-pi-2232778d0f663768ab27edc35cb73040-exec-1   0/1       PodInitializing   0          7s
spark-pi-2232778d0f663768ab27edc35cb73040-exec-2   1/1       Running           0          7s
spark-pi-2232778d0f663768ab27edc35cb73040-exec-3   0/1       PodInitializing   0          7s

$ kubectl get pods
NAME                                               READY     STATUS    RESTARTS   AGE
spark-pi-2232778d0f663768ab27edc35cb73040-driver   1/1       Running   0          21s
spark-pi-2232778d0f663768ab27edc35cb73040-exec-1   1/1       Running   0          9s
spark-pi-2232778d0f663768ab27edc35cb73040-exec-2   1/1       Running   0          9s
spark-pi-2232778d0f663768ab27edc35cb73040-exec-3   1/1       Running   0          9s
```

After the job has finished, the driver pod will be in a "Completed" state.

```console
kubectl get pods --show-all
```

Output:

```console
NAME                                               READY     STATUS      RESTARTS   AGE
spark-pi-2232778d0f663768ab27edc35cb73040-driver   0/1       Completed   0          1m
```

The following command helps to see the logs of the driver pod. Replace the pod name with your driver pod's name.

```console
kubectl logs spark-pi-2232778d0f663768ab27edc35cb73040-driver
```

Output:

```console
... truncated ...

2018-03-08 02:16:24 INFO  DAGScheduler:54 - Job 0 finished: reduce at SparkPi.scala:38, took 3.198249 s
Pi is roughly 3.152155760778804
2018-03-08 02:16:24 INFO  AbstractConnector:318 - Stopped Spark@482d776b{HTTP/1.1,[http/1.1]}{0.0.0.0:4040}

... truncated ...
```

In this example, the logs show the job result.

When the job is running, there is an option to set up port forwarding to access the Spark UI. Open up a new command-line window and enter the following command.

```console
kubectl port-forward spark-pi-2232778d0f663768ab27edc35cb73040-driver 4040:4040
```

Output:

```console
Forwarding from 127.0.0.1:4040 -> 4040
```

To access Spark UI, open the address `127.0.0.1:4040` in a browser.

![Spark UI](media/aks-spark-job/spark-ui.png)

## Pre-packaging Spark job dependencies in a container image

In the example above, the `jar` file of the Spark job was uploaded to a publicly accessible location. Another option is to pre-mount application dependencies into custom-built Docker images. In other words, this referencing the job `jar` file from the local context of the container when submitting a job.

To do that, find the `dockerfile` for the Spark image located at `$sparkdir/resource-managers/kubernetes/docker/src/main/dockerfiles/spark/` directory, and add the `ADD` statement for the Spark job `jar` somewhere between `WORKDIR` and `ENTRYPOINT` declarations.

```console
... truncated ...

WORKDIR /opt/spark/work-dir

ADD /path/to/SparkPi-assembly-0.1.0-SNAPSHOT.jar SparkPi-assembly-0.1.0-SNAPSHOT.jar

ENTRYPOINT [ "/opt/entrypoint.sh" ]
```

Where `/path/to/SparkPi-assembly-0.1.0-SNAPSHOT.jar` is a path to the `SparkPi-assembly-0.1.0-SNAPSHOT.jar`, or your custom `jar` file on your local filesystem.

Build and push the image with the `dockerfile` change.

```console
./bin/docker-image-tool.sh -r <your container repository name> -t <tag> build
./bin/docker-image-tool.sh -r <your container repository name> -t <tag> push
```

This way, instead of indicating a remote `jar` URL when submitting a job, `local://` scheme can be used with the path to the `jar` from the Docker image.

```console
./bin/spark-submit \
    --master k8s://https://<k8s-apiserver-host>:<k8s-apiserver-port> \
    --deploy-mode cluster \
    --name spark-pi \
    --class org.apache.spark.examples.SparkPi \
    --conf spark.executor.instances=3 \
    --conf spark.kubernetes.container.image=<spark-image> \
    local:///opt/spark/work-dir/<your-jar-name>.jar
```

# Next Steps

Check out [Spark documentation](https://spark.apache.org/docs/latest/running-on-kubernetes.html) for more details.

<!-- LINKS - external -->
[storage-account]: https://docs.microsoft.com/en-us/azure/storage/common/storage-azure-cli
[apache-spark]: https://spark.apache.org/
[spark-latest-release]: https://spark.apache.org/releases/spark-release-2-3-0.html
[spark-quickstart]: https://spark.apache.org/docs/latest/quick-start.html
[docker-hub]: https://docs.docker.com/docker-hub/
[acr-create]: https://docs.microsoft.com/en-us/azure/container-registry/container-registry-get-started-azure-cli
[azure-cli]: https://docs.microsoft.com/en-us/cli/azure/?view=azure-cli-latest
[sbt-install]: https://www.scala-sbt.org/1.0/docs/Setup.html
[aks-quickstart]: https://docs.microsoft.com/en-us/azure/aks/
[java-install]: http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html
[spark-conf]: https://spark.apache.org/docs/latest/configuration.html
[acr-aks]: https://docs.microsoft.com/en-us/azure/container-registry/container-registry-auth-aks