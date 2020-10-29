---
title: Configure Linux Python apps
description: Learn how to configure the Python container in which web apps are run, using both the Azure portal and the Azure CLI. 
ms.topic: quickstart
ms.date: 10/06/2020
ms.reviewer: astay; kraigb
ms.custom: mvc, seodec18, devx-track-python, devx-track-azurecli
---

# Configure a Linux Python app for Azure App Service

This article describes how [Azure App Service](overview.md) runs Python apps, and how you can customize the behavior of App Service when needed. Python apps must be deployed with all the required [pip](https://pypi.org/project/pip/) modules.

The App Service deployment engine automatically activates a virtual environment and runs `pip install -r requirements.txt` for you when you deploy a [Git repository](deploy-local-git.md), or a [zip package](deploy-zip.md).

This guide provides key concepts and instructions for Python developers who use a built-in Linux container in App Service. If you've never used Azure App Service, first follow the [Python quickstart](quickstart-python.md) and [Python with PostgreSQL tutorial](tutorial-python-postgresql-app.md).

You can use either the [Azure portal](https://portal.azure.com) or the Azure CLI for configuration:

- **Azure portal**, use the app's **Settings** > **Configuration** page as described on [Configure an App Service app in the Azure portal](configure-common.md).

- **Azure CLI**: you have two options.

    - Run commands in the [Azure Cloud Shell](../cloud-shell/overview.md), which you can open using the **Try It** button on the top right corner of code blocks.
    - Run commands locally by installing the latest version of the [Azure CLI](/cli/azure/install-azure-cli), then sign in to Azure using [az login](/cli/azure/reference-index#az-login).
    
> [!NOTE]
> Linux is currently the recommended option for running Python apps in App Service. For information on the Windows option, see [Python on the Windows flavor of App Service](/visualstudio/python/managing-python-on-azure-app-service).

## Configure Python version

- **Azure portal**: use the **General settings** tab on the **Configuration** page as described on [Configure general settings](configure-common.md#configure-general-settings) for Linux containers.

- **Azure CLI**:

    -  Show the current Python version with [az webapp config show](/cli/azure/webapp/config#az_webapp_config_show):
    
        ```azurecli-interactive
        az webapp config show --resource-group <resource-group-name> --name <app-name> --query linuxFxVersion
        ```
        
        Replace `<resource-group-name>` and `<app-name>` with the names appropriate for your web app.
    
    - Set the Python version with [az webapp config set](/cli/azure/webapp/config#az_webapp_config_set)
        
        ```azurecli-interactive
        az webapp config set --resource-group <resource-group-name> --name <app-name> --linux-fx-version "PYTHON|3.7"
        ```
    
    - Show all Python versions that are supported in Azure App Service with [az webapp list-runtimes](/cli/azure/webapp#az_webapp_list_runtimes):
    
        ```azurecli-interactive
        az webapp list-runtimes --linux | grep PYTHON
        ```
    
You can run an unsupported version of Python by building your own container image instead. For more information, see [use a custom Docker image](tutorial-custom-container.md?pivots=container-linux).

<!-- <a> element here to preserve external links-->
<a name="access-environment-variables"></a>

## Customize build automation

App Service's build system, called Oryx, performs the following steps when you deploy your app using Git or zip packages:

1. Run a custom pre-build script if specified by the `PRE_BUILD_COMMAND` setting.
1. Run `pip install -r requirements.txt`. The *requirements.txt* file must be present in the project's root folder. Otherwise, the build process reports the error: "Could not find setup.py or requirements.txt; Not running pip install."
1. If *manage.py* is found in the root of the repository (indicating a Django app), run *manage.py collectstatic*. However, if the `DISABLE_COLLECTSTATIC` setting is `true`, this step is skipped.
1. Run custom post-build script if specified by the `POST_BUILD_COMMAND` setting.

By default, the `PRE_BUILD_COMMAND`, `POST_BUILD_COMMAND`, and `DISABLE_COLLECTSTATIC` settings are empty. 

- To disable running collectstatic when building Django apps, set the `DISABLE_COLLECTSTATIC` setting to true.

- To run pre-build commands, set the `PRE_BUILD_COMMAND` setting to contain either a command, such as `echo Pre-build command`, or a path to a script file relative to your project root, such as `scripts/prebuild.sh`. All commands must use relative paths to the project root folder.

- To run post-build commands, set the `POST_BUILD_COMMAND` setting to contain either a command, such as `echo Post-build command`, or a path to a script file relative to your project root, such as `scripts/postbuild.sh`. All commands must use relative paths to the project root folder.

For additional settings that customize build automation, see [Oryx configuration](https://github.com/microsoft/Oryx/blob/master/doc/configuration.md). 

For more information on how App Service runs and builds Python apps in Linux, see [How Oryx detects and builds Python apps](https://github.com/microsoft/Oryx/blob/master/doc/runtimes/python.md).

> [!NOTE]
> The `PRE_BUILD_SCRIPT_PATH` and `POST_BUILD_SCRIPT_PATH` settings are identical to `PRE_BUILD_COMMAND` and `POST_BUILD_COMMAND` and are supported for legacy purposes.
> 
> A setting named `SCM_DO_BUILD_DURING_DEPLOYMENT`, if it contains `true` or 1, triggers an Oryx build happens during deployment. The setting is true when deploying using git, the Azure CLI command `az webapp up`, and Visual Studio Code.

> [!NOTE]
> Always use relative paths in all pre- and post-build scripts because the build container in which Oryx runs is different from the runtime container in which the app runs. Never rely on the exact placement of your app project folder within the container (for example, that it's placed under *site/wwwroot*).

## Production settings for Django apps

For a production environment like Azure App Service, Django apps should follow Django's [Deployment checklist](https://docs.djangoproject.com/en/3.1/howto/deployment/checklist/) (djangoproject.com).

The following table describes the production settings that are relevant to Azure. These settings are defined in the app's *setting.py* file.

| Django setting | Instructions for Azure |
| --- | --- |
| `SECRET_KEY` | Store the value in an App Service setting as described on [Access app settings as environment variables](#access-app-settings-as-environment-variables). You can alternately [store the value as a "secrete" in Azure Key Vault](/azure/key-vault/secrets/quick-create-python). |
| `DEBUG` | Create a `DEBUG` setting on App Service with the value 0 (false), then load the value as an environment variable. In your development environment, create a `DEBUG` environment variable with the value 1 (true). |
| `ALLOWED_HOSTS` | In production, Django requires that you include app's URL in the `ALLOWED_HOSTS` array of *settings.py*. You can retrieve this URL at runtime with the code, `os.environ['WEBSITE_HOSTNAME']`. App Service automatically sets the `WEBSITE_HOSTNAME` environment variable to the app's URL. |
| `DATABASES` | Define settings in App Service for the database connection and load them as environment variables to populate the [`DATABASES`](https://docs.djangoproject.com/en/3.1/ref/settings/#std:setting-DATABASES) dictionary. You can alternately store the values (especially the username and password) as [Azure Key Vault secrets](/azure/key-vault/secrets/quick-create-python). |

## Container characteristics

When deployed to App Service, Python apps run within a Linux Docker container that's defined in the [App Service Python GitHub repository](https://github.com/Azure-App-Service/python). You can find the image configurations inside the version-specific directories.

This container has the following characteristics:

- Apps are run using the [Gunicorn WSGI HTTP Server](https://gunicorn.org/), using the additional arguments `--bind=0.0.0.0 --timeout 600`.
    - You can provide configuration settings for Gunicorn through a *gunicorn.conf.py* file in the project root, as described on [Gunicorn configuration overview](https://docs.gunicorn.org/en/stable/configure.html#configuration-file) (docs.gunicorn.org). You can alternately [customize the startup command](#customize-startup-command).

    - To protect your web app from accidental or deliberate DDOS attacks, Gunicorn is run behind an Nginx reverse proxy as described on [Deploying Gunicorn](https://docs.gunicorn.org/en/latest/deploy.html) (docs.gunicorn.org).

- By default, the base container image includes only the Flask web framework, but the container supports other frameworks that are WSGI-compliant and compatible with Python 3.6+, such as Django.

- To install additional packages, such as Django, create a [*requirements.txt*](https://pip.pypa.io/en/stable/user_guide/#requirements-files) file in the root of your project that specifies your direct dependencies. App Service then installs those dependencies automatically when you deploy your project.

    The *requirements.txt* file *must* be in the project root for dependencies to be installed. Otherwise, the build process reports the error: "Could not find setup.py or requirements.txt; Not running pip install." If you encounter this error, check the location of your requirements file.

- App Service automatically defines an environment variable named `WEBSITE_HOSTNAME` with the web app's URL, such as `msdocs-hello-world.azurewebsites.net`. It also defines `WEBSITE_SITE_NAME` with the name of your app, such as `msdocs-hello-world`. 
   
## Container startup process

During startup, the App Service on Linux container runs the following steps:

1. Use a [custom startup command](#customize-startup-command), if provided.
2. Check for the existence of a [Django app](#django-app), and launch Gunicorn for it if detected.
3. Check for the existence of a [Flask app](#flask-app), and launch Gunicorn for it if detected.
4. If no other app is found, start a default app that's built into the container.

The following sections provide additional details for each option.

### Django app

For Django apps, App Service looks for a file named `wsgi.py` within your app code, and then runs Gunicorn using the following command:

```bash
# <module> is the name of the folder that contains wsgi.py
gunicorn --bind=0.0.0.0 --timeout 600 <module>.wsgi
```

If you want more specific control over the startup command, use a [custom startup command](#customize-startup-command), replace `<module>` with the name of folder that contains *wsgi.py*, and add a `--chdir` argument if that module is not in the project root. For example, if your *wsgi.py* is located under *knboard/backend/config* from your project root, use the arguments `--chdir knboard/backend config.wsgi`.

To enable production logging, add the `--access-logfile` and `--error-logfile` parameters as shown in the examples for [custom startup commands](#customize-startup-command).

### Flask app

For Flask, App Service looks for a file named *application.py* or *app.py* and starts Gunicorn as follows:

```bash
# If application.py
gunicorn --bind=0.0.0.0 --timeout 600 application:app

# If app.py
gunicorn --bind=0.0.0.0 --timeout 600 app:app
```

If your main app module is contained in a different file, use a different name for the app object, or you want to provide additional arguments to Gunicorn, use a [custom startup command](#customize-startup-command).

### Default behavior

If the App Service doesn't find a custom command, a Django app, or a Flask app, then it runs a default read-only app, located in the _opt/defaultsite_ folder. The default app appears as follows:

![Default App Service on Linux web page](media/configure-language-python/default-python-app.png)

## Customize startup command

As noted earlier in this article, you can provide configuration settings for Gunicorn through a *gunicorn.conf.py* file in the project root, as described on [Gunicorn configuration overview](https://docs.gunicorn.org/en/stable/configure.html#configuration-file).

If such configuration is not sufficient, you can control the container's startup behavior by providing either a custom startup command or multiple commands in a startup command file. A startup command file can use whatever name you choose, such as *startup.sh*, *startup.cmd*, *startup.txt*, and so on.

All commands must use relative paths to the project root folder.

To specify a startup command or command file:

- **Azure portal**: select the app's **Configuration** page, then select **General settings**. In the **Startup Command** field, place either the full text of your startup command or the name of your startup command file. Then select **Save** to apply the changes. See [Configure general settings](configure-common.md#configure-general-settings) for Linux containers.

- **Azure CLI**: use the [az webapp config set](/cli/azure/webapp/config#az_webapp_config_set) command with the `--startup-file` parameter to set the startup command or file:

    ```azurecli-interactive
    az webapp config set --resource-group <resource-group-name> --name <app-name> --startup-file "<custom-command>"
    ```
        
    Replace `<custom-command>` with either the full text of your startup command or the name of your startup command file.
        
App Service ignores any errors that occur when processing a custom startup command or file, then continues its startup process by looking for Django and Flask apps. If you don't see the behavior you expect, check that your startup command or file is error-free and that a startup command file is deployed to App Service along with your app code. You can also check the [Diagnostic logs](#access-diagnostic-logs) for additional information. Also check the app's **Diagnose and solve problems** page on the [Azure portal](https://portal.azure.com).

### Example startup commands

- **Added Gunicorn arguments**: The following example adds the `--workers=4` to a Gunicorn command line for starting a Django app: 

    ```bash
    # <module-path> is the relative path to the folder that contains the module
    # that contains wsgi.py; <module> is the name of the folder containing wsgi.py.
    gunicorn --bind=0.0.0.0 --timeout 600 --workers=4 --chdir <module_path> <module>.wsgi
    ```    

    For more information, see [Running Gunicorn](https://docs.gunicorn.org/en/stable/run.html) (docs.gunicorn.org).

- **Enable production logging for Django**: Add the `--access-logfile '-'` and `--error-logfile '-'` arguments to the command line:

    ```bash    
    # '-' for the log files means stdout for --access-logfile and stderr for --error-logfile.
    gunicorn --bind=0.0.0.0 --timeout 600 --workers=4 --chdir <module_path> <module>.wsgi --access-logfile '-' --error-logfile '-'
    ```    

    These logs will appear in the [App Service log stream](#access-diagnostic-logs).

    For more information, see [Gunicorn logging](https://docs.gunicorn.org/en/stable/settings.html#logging) (docs.gunicorn.org).
    
- **Custom Flask main module**: by default, App Service assumes that a Flask app's main module is *application.py* or *app.py*. If your main module uses a different name, then you must customize the startup command. For example, yf you have a Flask app whose main module is *hello.py* and the Flask app object in that file is named `myapp`, then the command is as follows:

    ```bash
    gunicorn --bind=0.0.0.0 --timeout 600 hello:myapp
    ```
    
    If your main module is in a subfolder, such as `website`, specify that folder with the `--chdir` argument:
    
    ```bash
    gunicorn --bind=0.0.0.0 --timeout 600 --chdir website hello:myapp
    ```
    
- **Use a non-Gunicorn server**: To use a different web server, such as [aiohttp](https://aiohttp.readthedocs.io/en/stable/web_quickstart.html), use the appropriate command as the startup command or in the startup command file:

    ```bash
    python3.7 -m aiohttp.web -H localhost -P 8080 package.module:init_func
    ```

## Access app settings as environment variables

App settings are values stored in the cloud specifically for your app as described on [Configure app settings](configure-common.md#configure-app-settings). These settings are available to your app code as environment variables and accessed using the standard [os.environ](https://docs.python.org/3/library/os.html#os.environ) pattern.

For example, if you've created app setting called `DATABASE_SERVER`, the following code retrieves that setting's value:

```python
db_server = os.environ['DATABASE_SERVER']
```
    
## Detect HTTPS session

In App Service, [SSL termination](https://wikipedia.org/wiki/TLS_termination_proxy) (wikipedia.org) happens at the network load balancers, so all HTTPS requests reach your app as unencrypted HTTP requests. If your app logic needs to check if the user requests are encrypted or not, inspect the `X-Forwarded-Proto` header.

```python
if 'X-Forwarded-Proto' in request.headers and request.headers['X-Forwarded-Proto'] == 'https':
# Do something when HTTPS is used
```

Popular web frameworks let you access the `X-Forwarded-*` information in your standard app pattern. In [CodeIgniter](https://codeigniter.com/), the [is_https()](https://github.com/bcit-ci/CodeIgniter/blob/master/system/core/Common.php#L338-L365) checks the value of `X_FORWARDED_PROTO` by default.

## Access diagnostic logs

[!INCLUDE [Access diagnostic logs](../../includes/app-service-web-logs-access-linux-no-h.md)]

To access logs through the Azure portal, select **Monitoring** > **Log stream** on the left side menu for your app.

## Open SSH session in browser

[!INCLUDE [Open SSH session in browser](../../includes/app-service-web-ssh-connect-builtin-no-h.md)]

## Troubleshooting

- **You see the default app after deploying your own app code.** The default app appears because you either haven't deployed your app code to App Service, or App Service failed to find your app code and ran the default app instead.

    - Restart the App Service, wait 15-20 seconds, and check the app again.
    
    - Be sure you're using App Service for Linux rather than a Windows-based instance. From the Azure CLI, run the command `az webapp show --resource-group <resource-group-name> --name <app-name> --query kind`, replacing `<resource-group-name>` and `<app-service-name>` accordingly. You should see `app,linux` as output; otherwise, recreate the App Service and choose Linux.
    
    - Use SSH or the Kudu console to connect directly to the App Service and verify that your files exist under *site/wwwroot*. If your files don't exist, review your deployment process and redeploy the app.
    
    - If your files exist, then App Service wasn't able to identify your specific startup file. Check that your app is structured as App Service expects for [Django](#django-app) or [Flask](#flask-app), or use a [custom startup command](#customize-startup-command).

- **You see the message "Service Unavailable" in the browser.** The browser has timed out waiting for a response from App Service, which indicates that App Service started the Gunicorn server, but the arguments that specify the app code are incorrect.

    - Refresh the browser, especially if you're using the lowest pricing tiers in your App Service Plan. The app may take longer to start up when using free tiers, for example, and becomes responsive after you refresh the browser.

    - Check that your app is structured as App Service expects for [Django](#django-app) or [Flask](#flask-app), or use a [custom startup command](#customize-startup-command).

    - Examine the [log stream](#access-diagnostic-logs) for any error messages.

- **The log stream shows "Could not find setup.py or requirements.txt; Not running pip install."**: The Oryx build process failed to find your *requirements.txt* file.

    - Use SSH or the Kudu console to connect directly to the App Service and verify that *requirements.txt* exists directly under *site/wwwroot*. If it doesn't exist, make site the file exists in your repository and is included in your deployment. If it exists in a separate folder, move it to the root.

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Python app with PostgreSQL](tutorial-python-postgresql-app.md)

> [!div class="nextstepaction"]
> [Tutorial: Deploy from private container repository](tutorial-custom-container.md?pivots=container-linux)

> [!div class="nextstepaction"]
> [App Service Linux FAQ](faq-app-service-linux.md)
