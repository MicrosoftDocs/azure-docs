---
title: Open a Container Shell (SSH) and Run Commands
description: Learn how to access containers in Azure App Service, open an interactive Linux shell, run detached commands, and control SSH access without configuring an SSH server in your custom image.
keywords: azure app service, web app, linux, windows, oss
author: msangapu-msft

ms.assetid: 66f9988f-8ffa-414a-9137-3a9b15a5573c
ms.topic: how-to
ms.date: 10/08/2026
ms.author: msangapu
ms.custom: devx-track-azurecli, linux-related-content
zone_pivot_groups: app-service-containers-windows-linux
ms.service: azure-app-service

# customer intent: As an administrator, I want to access my App Service container and run commands so that I can troubleshoot my application.
---
# Open a container shell (SSH) and run commands in Azure App Service

<a id="open-an-ssh-session-to-a-container-in-azure-app-service"></a>

App Service provides authenticated access to running app containers for troubleshooting and administrative tasks. Treat container access as a privileged operation and grant access only to users who need it.

::: zone pivot="container-windows"

App Service provides browser-based SSH access to apps hosted in Windows custom containers. No special image configuration is required for the [browser session](#open-ssh-session-in-browser).

The Azure CLI `az webapp exec` command is supported only for Linux web apps. Don't use the Linux CLI examples in this article for Windows App Service plans.

::: zone-end

::: zone pivot="container-linux"

For built-in and custom Linux containers, the newer browser terminal and `az webapp exec` use Kudu as an authenticated proxy to connect to the running container. These options don't require you to install an SSH server, embed an SSH password, expose an SSH port, or start an SSH daemon in your custom image. Legacy Kudu WebSSH and `az webapp ssh` access might still require an SSH server in a custom image.

Use the Azure portal for a browser session, or use the preview [`az webapp exec`](/cli/azure/webapp#az-webapp-exec) command for a local terminal session or detached command execution. The browser terminal requires `/bin/bash` in the image and doesn't currently support selecting another shell. If the image has a different shell, use `az webapp exec --shell /bin/sh` instead. Images without a shell, including distroless images, can't open an interactive session.

::: zone-end

## Prerequisites

- The app and its container are running.
- You're authorized to access the app's SCM/Kudu site. For permissions, see [RBAC permissions required to access Kudu](resources-kudu.md#rbac-permissions-required-to-access-kudu).
- Your client has network access to the SCM endpoint. Check the app's [access restrictions](app-service-ip-restrictions.md) and private networking configuration if you can't connect.

::: zone pivot="container-linux"

- For the CLI examples, install [Azure CLI](/cli/azure/install-azure-cli) 2.90.0 or later and [sign in](/cli/azure/authenticate-azure-cli). Check your version with `az version`. You can also use [Azure Cloud Shell](../cloud-shell/overview.md) if its CLI meets this requirement.
- For a CLI interactive session, use an interactive terminal and a shell that exists in your image. The default is `/bin/bash`; for an image without bash, specify `--shell /bin/sh` if that shell is available.

::: zone-end

## Open SSH session in browser

[!INCLUDE [Open SSH session in browser](../../includes/app-service-web-ssh-connect-no-h.md)]

::: zone pivot="container-linux"

## Open SSH session with Azure CLI

The preview `az webapp exec` command opens an interactive shell in your app's main container. The session uses your local terminal on Windows, macOS, and Linux; it doesn't open a browser.

```azurecli
az webapp exec --resource-group <resource-group-name> --name <app-name>
```

For an image that uses `/bin/sh` instead of bash:

```azurecli
az webapp exec --resource-group <resource-group-name> --name <app-name> --shell /bin/sh
```

You can run commands and inspect their output in this session. For example, use `top` if it's installed in the image. To inspect the SCM/Kudu container instead of the app container:

```azurecli
az webapp exec --resource-group <resource-group-name> --name <app-name> --target kudu
```

The app and Kudu containers are different environments. Run commands that depend on your app's runtime, dependencies, or network connectivity in the app container.

### Select an instance or deployment slot

By default, the CLI connects to one app instance. To find instance IDs:

```azurecli
az webapp list-instances --resource-group <resource-group-name> --name <app-name> --output table
```

To connect to a specific instance:

```azurecli
az webapp exec --resource-group <resource-group-name> --name <app-name> --instance <instance-id>
```

Add `--slot <slot-name>` to access a deployment slot. When selecting a slot's instance, also add `--slot` to `az webapp list-instances`.

Interactive shell mode supports only one instance at a time.

## Run commands without an interactive session

Use `--mode execute` to submit a command to the main app container without opening a terminal session. The command runs detached. This mode is useful for background diagnostics or other work that doesn't require immediate output.

> [!IMPORTANT]
> Execute mode is **fire-and-forget**. A result with status `accepted` confirms only that the request was accepted, not that the command ran, completed, or succeeded. The CLI doesn't return the remote command's standard output, standard error, or exit code. A failed submission produces a CLI error, but a successful CLI invocation isn't proof of successful remote execution. Use an interactive shell when you need to observe the result immediately.

### Run a program directly

Use `--command` to specify a program and its arguments. Quote the whole command:

```azurecli
az webapp exec --resource-group <resource-group-name> --name <app-name> --mode execute --command "python3 /home/site/wwwroot/scripts/diagnostics.py" --working-directory /home/site/wwwroot --instance <instance-id>
```

Replace the script path with a script deployed in your app. The executable and its dependencies must exist in the container.

`--command` doesn't interpret shell operators such as `>`, `|`, or `&&`. Use `--shell-command` instead when you need a shell. These two options are mutually exclusive.

### Capture output and check completion

The following example uses Bash client quoting, such as in Cloud Shell. It submits a read-only diagnostic command to one instance and records its output and exit status separately. Replace `<run-id>` with a new identifier for each invocation and `<instance-id>` with an ID from `az webapp list-instances`.

```bash
az webapp exec --resource-group <resource-group-name> --name <app-name> \
  --mode execute --instance <instance-id> --shell /bin/sh \
  --shell-command 'uname -a > /home/LogFiles/diagnostics-<run-id>.log 2>&1; result=$?; printf "%s\n" "$result" > /home/LogFiles/diagnostics-<run-id>.exit'
```

Ensure `/bin/sh` and the diagnostic command exist, and that `/home/LogFiles` exists and is writable. Persistence of `/home` in custom containers depends on the app's [storage configuration](configure-custom-container.md#use-persistent-shared-storage). The single quotes keep the client shell from expanding `$?` and `$result` before the request reaches the container.

After submission, open an [interactive app shell](#open-ssh-session-with-azure-cli) on the same instance and inspect the files:

```sh
cat /home/LogFiles/diagnostics-<run-id>.log
cat /home/LogFiles/diagnostics-<run-id>.exit
```

A recorded exit status of `0` indicates that the diagnostic command succeeded. A nonzero status indicates failure; inspect the log. If the status file doesn't exist, completion hasn't been established: the command might still be running, might not have started, or might have been interrupted. Don't infer success from acceptance or from the presence of a partial log. Use a fresh run identifier so an older status file can't be mistaken for the current result.

The CLI doesn't provide a completion-polling API. Redirecting output to a file doesn't automatically make it available in App Service log streaming.

For database migrations or other operations that change shared state, select **one** instance, check completion separately, and don't rerun the operation solely because the submission returned no output. Keep the interactive workflow when you need to verify success before continuing.

### Run independent commands on multiple instances

Execute mode also accepts a comma-separated list of instance IDs or `--instance all`. Requests for multiple instances are submitted in parallel. For example, run a deployed per-instance diagnostic script on every instance:

```azurecli
az webapp exec --resource-group <resource-group-name> --name <app-name> --mode execute --command "python3 /home/site/wwwroot/scripts/diagnostics.py" --instance all
```

The script must capture its own results. Use distinct per-instance and per-run output paths if storage is shared. Don't use `all` for shared database migrations or other operations that must run only once. If some submissions fail, the CLI reports an error even though other instances might have accepted the command.

Add `--slot <slot-name>` to execute against a deployment slot.

### Limitations

- Execute mode targets only the main app container. You can use `--target kudu` only in interactive shell mode.
- Use `--working-directory` or `--cwd` only in execute mode, and provide an absolute path.
- Provide an absolute path for `--shell`. In execute mode, you can use it only with `--shell-command`.
- This preview doesn't provide file transfer, port forwarding, or an option to select arbitrary sidecar containers. Use supported [deployment methods](deploy-zip.md) to upload files.
- Detached execution isn't a durable job scheduler. A container restart or replacement can interrupt work. Don't assume automatic retries or exactly-once execution.

::: zone-end

## Control SSH access

Disable SSH access on apps that don't need it by setting the app's `sshEnabled` configuration property to `false`. The following examples use Bash JSON quoting:

```bash
az webapp config set --resource-group <resource-group-name> --name <app-name> \
  --generic-configurations '{"sshEnabled": false}'
```

To enable SSH access again:

```bash
az webapp config set --resource-group <resource-group-name> --name <app-name> \
  --generic-configurations '{"sshEnabled": true}'
```

To inspect the configuration:

```azurecli
az webapp config show --resource-group <resource-group-name> --name <app-name> --query sshEnabled
```

Add `--slot <slot-name>` to configure or inspect a deployment slot.

For governance across apps and slots, use the **App Service apps should disable SSH** and **App Service app slots should disable SSH** built-in policies. See the [App Service policy reference](policy-reference.md) for assignment links.

Both policies default to `Audit` and also support `Deny` and `Disabled`. They evaluate an absent or non-false `sshEnabled` value as noncompliant. Audit reports noncompliance; it doesn't disable SSH. Deny prevents noncompliant resource changes; it doesn't automatically reconfigure existing apps. You can assign policies at subscription or management-group scope, including the tenant root management group for tenant-wide governance.

SSH configuration and policy compliance aren't substitutes for securing access to SCM/Kudu. Use appropriate [RBAC permissions](resources-kudu.md#rbac-permissions-required-to-access-kudu) and [network access restrictions](app-service-ip-restrictions.md).

## Troubleshoot container access

- Confirm the app starts successfully. Review [diagnostic logs](troubleshoot-diagnostic-logs.md) for startup failures.
- For CLI access, check the CLI version, the selected app, slot, and instance, and whether the requested executable or shell exists.
- Check authorization and network connectivity to the SCM endpoint. You don't need to enable basic publishing authentication; the CLI supports Microsoft Entra authentication when SCM basic authentication is disabled. See [Disable basic authentication](configure-basic-auth-disable.md).
- Changes you make inside the container don't replace updating and redeploying the app or image. The container restarts can remove files outside persisted storage.

## Related content

- [Configure a custom container](configure-custom-container.md)
- [Kudu service overview](resources-kudu.md)
- [Azure CLI webapp command reference](/cli/azure/webapp#az-webapp-exec)
- [App Service built-in policy reference](policy-reference.md)
