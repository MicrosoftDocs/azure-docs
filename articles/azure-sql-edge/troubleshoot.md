---
title: Troubleshoot Azure SQL Edge deployments
description: Learn about possible errors when deploying Azure SQL Edge
author: rwestMSFT
ms.author: randolphwest
ms.date: 09/14/2023
ms.service: sql-edge
ms.topic: troubleshooting
keywords:
  - SQL Edge
  - troubleshooting
  - deployment errors
---
# Troubleshoot Azure SQL Edge deployments

> [!IMPORTANT]  
> Azure SQL Edge no longer supports the ARM64 platform.

This article provides information about possible errors seen when deploying and using Azure SQL Edge containers, and provides troubleshooting techniques to help resolve these issues.

Azure SQL Edge supports two deployment models:

- Connected deployment through Azure IoT Edge: Azure SQL Edge is available on the Azure Marketplace and can be deployed as a module for [Azure IoT Edge](../iot-edge/about-iot-edge.md). For more information, see [Deploy Azure SQL Edge](deploy-portal.md).<br>

- Disconnected deployment: Azure SQL Edge container images can be pulled from Docker hub and deployed either as a standalone container or on a Kubernetes cluster. For more information, see [Deploy Azure SQL Edge with Docker](disconnected-deployment.md) and [Deploy an Azure SQL Edge container in Kubernetes](deploy-kubernetes.md).

## Troubleshoot IoT Edge device and deployments

If you get error while deploying SQL Edge through Azure IoT Edge, make sure that the `iotedge` service is properly configured and running. The following documents can be helpful when troubleshooting issues related to Azure IoT Edge:

- [Common issues and resolutions for Azure IoT Edge](../iot-edge/troubleshoot-common-errors.md).
- [Troubleshoot your IoT Edge device](../iot-edge/troubleshoot.md)

## Docker command errors

If you get errors for any `docker` commands, make sure that the Docker service is running, and try to run with elevated permissions.

For example, on Linux, you might get the following error when running `docker` commands:

```output
Cannot connect to the Docker daemon. Is the docker daemon running on this host?
```

If you get this error on Linux, try running the same commands prefaced with `sudo`. If that fails, verify the Docker service is running, and start it if necessary.

```bash
sudo systemctl status docker
sudo systemctl start docker
```

On Windows, verify that you're launching PowerShell or your command-prompt as an Administrator.

## Azure SQL Edge container startup errors

If the SQL Edge container fails to run, try the following tests:

- If you're using Azure IoT Edge, make sure that the module images were downloaded successfully, and that the environment variables and container create options are correctly specified in the module manifest.

- If you're using Docker or Kubernetes based deployment, make sure that the `docker run` command is correctly formed. For more information, see [Deploy Azure SQL Edge with Docker](disconnected-deployment.md) and [Deploy an Azure SQL Edge container in Kubernetes](deploy-kubernetes.md).

- If you get an error such as `failed to create endpoint CONTAINER_NAME on network bridge. Error starting proxy: listen tcp 0.0.0.0:1433 bind: address already in use.`, you're attempting to map the container port 1433 to a port that is already in use. This can happen if you're running SQL Edge locally on the host machine. It can also happen if you start two SQL Edge containers and try to map them both to the same host port. If this happens, use the `-p` parameter to map the container port 1433 to a different host port. For example:

  ```bash
  sudo docker run --cap-add SYS_PTRACE -e 'ACCEPT_EULA=1' -e 'MSSQL_SA_PASSWORD=yourStrong(!)Password' -p 1433:1433 --name azuresqledge -d mcr.microsoft.com/azure-sql-edge-developer.
  ```

- If you get an error such as `Got permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock: Get http://%2Fvar%2Frun%2Fdocker.sock/v1.30tdout=1&tail=all: dial unix /var/run/docker.sock: connect: permission denied` when trying to start a container, then add your user to the docker group in Ubuntu. Then sign out and sign back in again, as this change affects new sessions.

  ```bash
  usermod -aG docker $USER
  ```

- Check to see if there are any error messages from container.

  ```bash
  docker logs e69e056c702d
  ```

- If you're using any container management software, make sure it supports container processes running as root. The sqlservr process in the container runs as root.

- By default Azure SQL Edge containers run as a non-root user named `mssql`. If you're using mount points or data volumes to persist data, ensure that the `mssql` user has appropriate permissions on the volume. For more information, see [Run as non-root user](configure.md#run-azure-sql-edge-as-non-root-user) and [Persist Data](configure.md#persist-your-data).

- If your SQL Edge Docker container exits immediately after starting, check your docker logs. If you're using PowerShell on Windows with the `docker run` command, use double quotes instead of single quotes. With PowerShell Core, use single quotes.

- Review the [SQL Edge error logs](#errorlogs).

## SQL Edge connection failures

If you can't connect to the SQL Edge instance running in your container, try the following tests:

- Make sure that your SQL Edge container is running by looking at the `STATUS` column of the `docker ps -a` output. If not, use `docker start <Container ID>` to start it.

- If you mapped to a non-default host port (not 1433), make sure you're specifying the port in your connection string. You can see your port mapping in the `PORTS` column of the `docker ps -a` output. For more information on connecting to Azure SQL Edge, see [Connect and query Azure SQL Edge](connect.md).

- If you previously deployed SQL Edge with a mapped data volume or data volume container, and now use the existing mapped data volume or data volume container, SQL Edge ignores the value of `MSSQL_SA_PASSWORD` environment variable. Instead, the previously configured SA user password is used. This happens because SQL Edge reuses the existing `master` databases files in the mapped volume or data volume container. If you run into this issue, you can use the following options:

  - Connect using the previously used password, if it's still available.
  - Configure SQL Edge to use a different mapped volume or data volume container.
  - Remove the existing `master` database files (`master.mdf` and `mastlog.mdf`) from the mapped volume or data volume container.

- Review the [SQL Edge error logs](#errorlogs).

## <a id="errorlogs"></a> SQL Edge setup and error logs

By default, SQL Edge error logs are present in the `/var/opt/mssql/log` directory within the container and can be accessed using any of the following ways:

- If you mounted a host directory to `/var/opt/mssql` when you created your container, you can instead look in the `log` subdirectory on the mapped path on the host.

- By using an interactive command-prompt to connect to the container. If the container isn't running, first start the container. Then use an interactive command-prompt to inspect the logs. You can get the container ID by running the command `docker ps`.

  ```bash
  docker start <ContainerID>
  docker exec -it <ContainerID> "/bin/bash"
  ```

  From the bash session inside your container, run the following commands:

  ```bash
  cd /var/opt/mssql/log
  cat errorlog
  ```

- If the SQL Edge container is up and running and you're able to connect to the instance using client tools, then you can use the stored procedure `sp_readerrorlog` to read the contents of the SQL Edge error log.

## Execute commands in a container

If you have a running container, you can execute commands within the container from a host terminal.

To get the container ID run:

```bash
docker ps -a
```

To start a bash terminal in the container run:

```bash
docker exec -it <Container ID> /bin/bash
```

Now you can run commands as though you're running them at the terminal inside the container. When finished, type `exit`. This exits in the interactive command session, but your container continues to run.

### Enable verbose logging

If the default log level for the streaming engine doesn't provide enough information, debug logging for the streaming engine can be enabled in SQL Edge. To enable debug logging, add the `RuntimeLogLevel=debug` environment variable to your SQL Edge deployment. After enabling debug logging, attempt to reproduce the problem and check the logs for any relevant messages or exceptions.

> [!NOTE]  
> The Verbose Logging option should only be used for troubleshooting and not for regular production workload.

## Next steps

- [Machine Learning and Artificial Intelligence with ONNX in SQL Edge](onnx-overview.md)
- [Data Streaming in Azure SQL Edge](stream-data.md)
- [Data Retention and cleanup](data-retention-overview.md)
- [Filling time gaps and imputing missing values](imputing-missing-values.md)
