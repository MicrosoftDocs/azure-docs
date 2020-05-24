---
title: Configure Ruby apps - Azure App Service
description: Learn how to configure a pre-built Ruby container for your app. This article shows the most common configuration tasks. 
ms.topic: quickstart
ms.date: 03/28/2019
ms.reviewer: astay; kraigb
ms.custom: mvc, seodec18
---

# Configure a Linux Ruby app for Azure App Service

This article describes how [Azure App Service](app-service-linux-intro.md) runs Ruby apps, and how you can customize the behavior of App Service when needed. Ruby apps must be deployed with all the required [gems](https://rubygems.org/gems).

This guide provides key concepts and instructions for Ruby developers who use a built-in Linux container in App Service. If you've never used Azure App Service, you should follow the [Ruby quickstart](quickstart-ruby.md) and [Ruby with PostgreSQL tutorial](tutorial-ruby-postgres-app.md) first.

## Show Ruby version

To show the current Ruby version, run the following command in the [Cloud Shell](https://shell.azure.com):

```azurecli-interactive
az webapp config show --resource-group <resource-group-name> --name <app-name> --query linuxFxVersion
```

To show all supported Ruby versions, run the following command in the [Cloud Shell](https://shell.azure.com):

```azurecli-interactive
az webapp list-runtimes --linux | grep RUBY
```

You can run an unsupported version of Ruby by building your own container image instead. For more information, see [use a custom Docker image](tutorial-custom-docker-image.md).

## Set Ruby version

Run the following command in the [Cloud Shell](https://shell.azure.com) to set the Ruby version to 2.3:

```azurecli-interactive
az webapp config set --resource-group <resource-group-name> --name <app-name> --linux-fx-version "RUBY|2.3"
```

> [!NOTE]
> If you see errors similar to the following during deployment time:
> ```
> Your Ruby version is 2.3.3, but your Gemfile specified 2.3.1
> ```
> or
> ```
> rbenv: version `2.3.1' is not installed
> ```
> It means that the Ruby version configured in your project is different than the version that's installed in the container you're running (`2.3.3` in the example above). In the example above, check both *Gemfile* and *.ruby-version* and verify that the Ruby version is not set, or is set to the version that's installed in the container you're running (`2.3.3` in the example above).

## Access environment variables

In App Service, you can [set app settings](../configure-common.md?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json#configure-app-settings) outside of your app code. Then you can access them using the standard [ENV['\<path-name>']](https://ruby-doc.org/core-2.3.3/ENV.html) pattern. For example, to access an app setting called `WEBSITE_SITE_NAME`, use the following code:

```ruby
ENV['WEBSITE_SITE_NAME']
```

## Customize deployment

When you deploy a [Git repository](../deploy-local-git.md?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json), or a [Zip package](../deploy-zip.md?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json) with build processes switched on, the deployment engine (Kudu) automatically runs the following post-deployment steps by default:

1. Check if a *Gemfile* exists.
1. Run `bundle clean`. 
1. Run `bundle install --path "vendor/bundle"`.
1. Run `bundle package` to package gems into vendor/cache folder.

### Use --without flag

To run `bundle install` with the [--without](https://bundler.io/man/bundle-install.1.html) flag, set the `BUNDLE_WITHOUT` [app setting](../configure-common.md?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json#configure-app-settings) to a comma-separated list of groups. For example, the following command sets it to `development,test`.

```azurecli-interactive
az webapp config appsettings set --name <app-name> --resource-group <resource-group-name> --settings BUNDLE_WITHOUT="development,test"
```

If this setting is defined, then the deployment engine runs `bundle install` with `--without $BUNDLE_WITHOUT`.

### Precompile assets

The post-deployment steps don't precompile assets by default. To turn on asset precompilation, set the `ASSETS_PRECOMPILE` [app setting](../configure-common.md?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json#configure-app-settings) to `true`. Then the command `bundle exec rake --trace assets:precompile` is run at the end of the post-deployment steps. For example:

```azurecli-interactive
az webapp config appsettings set --name <app-name> --resource-group <resource-group-name> --settings ASSETS_PRECOMPILE=true
```

For more information, see [Serve static assets](#serve-static-assets).

## Customize start-up

By default, the Ruby container starts the Rails server in the following sequence (for more information, see the [start-up script](https://github.com/Azure-App-Service/ruby/blob/master/2.3.8/startup.sh)):

1. Generate a [secret_key_base](https://edgeguides.rubyonrails.org/security.html#environmental-security) value, if one doesn't exist already. This value is required for the app to run in production mode.
1. Set the `RAILS_ENV` environment variable to `production`.
1. Delete any *.pid* file in the *tmp/pids* directory that's left by a previously running Rails server.
1. Check if all dependencies are installed. If not, try installing gems from the local *vendor/cache* directory.
1. Run `rails server -e $RAILS_ENV`.

You can customize the start-up process in the following ways:

- [Serve static assets](#serve-static-assets)
- [Run in non-production mode](#run-in-non-production-mode)
- [Set secret_key_base manually](#set-secret_key_base-manually)

### Serve static assets

The Rails server in the Ruby container runs in production mode by default, and [assumes that assets are precompiled and are served by your web server](https://guides.rubyonrails.org/asset_pipeline.html#in-production). To serve static assets from the Rails server, you need to do two things:

- **Precompile the assets** - [Precompile the static assets locally](https://guides.rubyonrails.org/asset_pipeline.html#local-precompilation) and deploy them manually. Or, let the deployment engine handle it instead (see [Precompile assets](#precompile-assets).
- **Enable serving static files** - To serve static assets from the Ruby container, [set the `RAILS_SERVE_STATIC_FILES` app setting](../configure-common.md?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json#configure-app-settings) to `true`. For example:

    ```azurecli-interactive
    az webapp config appsettings set --name <app-name> --resource-group <resource-group-name> --settings RAILS_SERVE_STATIC_FILES=true
    ```

### Run in non-production mode

The Rails server runs in production mode by default. To run in development mode, for example, set the `RAILS_ENV` [app setting](../configure-common.md?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json#configure-app-settings) to `development`.

```azurecli-interactive
az webapp config appsettings set --name <app-name> --resource-group <resource-group-name> --settings RAILS_ENV="development"
```

However, this setting alone causes the Rails server to start in development mode, which accepts localhost requests only and isn't accessible outside of the container. To accept remote client requests, set the `APP_COMMAND_LINE` [app setting](../configure-common.md?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json#configure-app-settings) to `rails server -b 0.0.0.0`. This app setting lets you run a custom command in the Ruby container. For example:

```azurecli-interactive
az webapp config appsettings set --name <app-name> --resource-group <resource-group-name> --settings APP_COMMAND_LINE="rails server -b 0.0.0.0"
```

### <a name="set-secret_key_base-manually"></a> Set secret_key_base manually

To use your own `secret_key_base` value instead of letting App Service generate one for you, set the `SECRET_KEY_BASE` [app setting](../configure-common.md?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json#configure-app-settings) with the value you want. For example:

```azurecli-interactive
az webapp config appsettings set --name <app-name> --resource-group <resource-group-name> --settings SECRET_KEY_BASE="<key-base-value>"
```

## Access diagnostic logs

[!INCLUDE [Access diagnostic logs](../../../includes/app-service-web-logs-access-no-h.md)]

## Open SSH session in browser

[!INCLUDE [Open SSH session in browser](../../../includes/app-service-web-ssh-connect-builtin-no-h.md)]

[!INCLUDE [robots933456](../../../includes/app-service-web-configure-robots933456.md)]

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Rails app with PostgreSQL](tutorial-ruby-postgres-app.md)

> [!div class="nextstepaction"]
> [App Service Linux FAQ](app-service-linux-faq.md)
