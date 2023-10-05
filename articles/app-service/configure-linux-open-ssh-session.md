---
title: SSH access for Linux containers
description: You can open an SSH session to a Linux container in Azure App Service. Custom Linux containers are supported with some modifications to your custom image.
keywords: azure app service, web app, linux, oss
author: msangapu-msft

ms.assetid: 66f9988f-8ffa-414a-9137-3a9b15a5573c
ms.topic: article
ms.date: 11/18/2022
ms.author: msangapu
ms.custom: seodec18, devx-track-azurecli

---
# Open an SSH session to a Linux container in Azure App Service

[Secure Shell (SSH)](https://wikipedia.org/wiki/Secure_Shell) is commonly used to execute administrative commands remotely from a command-line terminal. App Service on Linux provides SSH support into the app container. 

![Linux App Service SSH](./media/configure-linux-open-ssh-session/app-service-linux-ssh.png)

You can also connect to the container directly from your local development machine using SSH and SFTP.

## Open SSH session in browser

[!INCLUDE [Open SSH session in browser](../../includes/app-service-web-ssh-connect-no-h.md)]

## Use SSH support with custom Docker images

See [Configure SSH in a custom container](configure-custom-container.md#enable-ssh).

## Open SSH session from remote shell

> [!NOTE]
> This feature is currently in Preview.
>

Using TCP tunneling you can create a network connection between your development machine and Web App for Containers over an authenticated WebSocket connection. It enables you to open an SSH session with your container running in App Service from the client of your choice.

To get started, you need to install [Azure CLI](/cli/azure/install-azure-cli). To see how it works without installing Azure CLI, open [Azure Cloud Shell](../cloud-shell/overview.md). 

Open a remote connection to your app using the [az webapp create-remote-connection](/cli/azure/webapp#az-webapp-create-remote-connection) command. Specify _\<subscription-id>_, _\<group-name>_ and _\<app-name>_ for your app.

```azurecli-interactive
az webapp create-remote-connection --subscription <subscription-id> --resource-group <resource-group-name> -n <app-name> &
```

> [!TIP]
> `&` at the end of the command is just for convenience if you are using Cloud Shell. It runs the process in the background so that you can run the next command in the same shell.

> [!NOTE]
> If this command fails, make sure [remote debugging](https://medium.com/@auchenberg/introducing-remote-debugging-of-node-js-apps-on-azure-app-service-from-vs-code-in-public-preview-9b8d83a6e1f0) is *disabled* with the following command:
>
> ```azurecli-interactive
> az webapp config set --resource-group <resource-group-name> -n <app-name> --remote-debugging-enabled=false
> ```

The command output gives you the information you need to open an SSH session.

```output
Port 21382 is open
SSH is available { username: root, password: Docker! }
Start your favorite client and connect to port 21382
```

Open an SSH session with your container with the client of your choice, using the local port. The following example uses the default [ssh](https://ss64.com/bash/ssh.html) command:

```bash
ssh root@127.0.0.1 -p <port>
```

When being prompted, type `yes` to continue connecting. You are then prompted for the password. Use `Docker!`, which was shown to you earlier.

<pre>
Warning: Permanently added '[127.0.0.1]:21382' (ECDSA) to the list of known hosts.
root@127.0.0.1's password:
</pre>

Once you're authenticated, you should see the session welcome screen.

<pre>
  _____
  /  _  \ __________ _________   ____
 /  /_\  \___   /  |  \_  __ \_/ __ \
/    |    \/    /|  |  /|  | \/\  ___/
\____|__  /_____ \____/ |__|    \___  &gt;
        \/      \/                  \/
A P P   S E R V I C E   O N   L I N U X

0e690efa93e2:~#
</pre>

You are now connected to your connector.  

Try running the [top](https://ss64.com/bash/top.html) command. You should be able to see your app's process in the process list. In the example output below, it's the one with `PID 263`.

<pre>
Mem: 1578756K used, 127032K free, 8744K shrd, 201592K buff, 341348K cached
CPU:   3% usr   3% sys   0% nic  92% idle   0% io   0% irq   0% sirq
Load average: 0.07 0.04 0.08 4/765 45738
  PID  PPID USER     STAT   VSZ %VSZ CPU %CPU COMMAND
    1     0 root     S     1528   0%   0   0% /sbin/init
  235     1 root     S     632m  38%   0   0% PM2 v2.10.3: God Daemon (/root/.pm2)
  263   235 root     S     630m  38%   0   0% node /home/site/wwwroot/app.js
  482   291 root     S     7368   0%   0   0% sshd: root@pts/0
45513   291 root     S     7356   0%   0   0% sshd: root@pts/1
  291     1 root     S     7324   0%   0   0% /usr/sbin/sshd
  490   482 root     S     1540   0%   0   0% -ash
45539 45513 root     S     1540   0%   0   0% -ash
45678 45539 root     R     1536   0%   0   0% top
45733     1 root     Z        0   0%   0   0% [init]
45734     1 root     Z        0   0%   0   0% [init]
45735     1 root     Z        0   0%   0   0% [init]
45736     1 root     Z        0   0%   0   0% [init]
45737     1 root     Z        0   0%   0   0% [init]
45738     1 root     Z        0   0%   0   0% [init]
</pre>

## Next steps

You can post questions and concerns on the [Azure forum](/answers/topics/azure-webapps.html).

For more information on Web App for Containers, see:

* [Introducing remote debugging of Node.js apps on Azure App Service from VS Code](https://medium.com/@auchenberg/introducing-remote-debugging-of-node-js-apps-on-azure-app-service-from-vs-code-in-public-preview-9b8d83a6e1f0)
* [Quickstart: Run a custom container on App Service](quickstart-custom-container.md?pivots=container-linux)
* [Using Ruby in Azure App Service on Linux](quickstart-ruby.md)
* [Azure App Service Web App for Containers FAQ](faq-app-service-linux.yml)
