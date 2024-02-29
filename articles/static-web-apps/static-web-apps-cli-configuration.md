---
title: Configure the Azure Static Web Apps CLI
description: Configure the Azure Static Web Apps CLI
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  conceptual
ms.date: 02/02/2024
ms.author: cshoe
---

# Configure the Azure Static Web Apps CLI

The Azure Static Web Apps (SWA) CLI gets configuration information for your static web app in one of two ways:

- CLI options (passed in at runtime)
- A CLI configuration file named *swa-cli.config.json*

> [!NOTE]
> By default, the SWA CLI looks for a configuration file named *swa-cli.config.json* in the current directory.

The configuration file can contain multiple configurations, each identified by a unique configuration name.

- If only a single configuration is present in the *swa-cli.config.json* file, `swa start` uses it by default.

- If options are loaded from a config file, then command line options are ignored.

## Example configuration file

The following code snippet shows the configuration file's shape.

```json
{
  "configurations": {
    "app": {
      "appDevserverUrl": "http://localhost:3000",
      "apiLocation": "api",
      "run": "npm run start",
      "swaConfigLocation": "./my-app-source"
    }
  }
}
```

When you only have one configuration section, as shown by this example, then the `swa start` command automatically uses these values.

## Initialize a configuration file

You can initialize your configuration file with the `swa init` command. If you run the command against an existing project, then `swa init` tries to guess the configuration settings for you.

By default, the process creates these settings in a *swa-cli.config.json* in the current working directory of your project. This directory is the default file name and location used by `swa` when searching for project configuration values.

```azstatic-cli
swa --config <PATH>
```

If the file contains only one named configuration, then that configuration is used by default. If multiple configurations are defined, then you pass the desired configuration name in as an option.

```azstatic-cli
swa --<CONFIG_NAME>
```

When the configuration file option is used, the settings are stored in JSON format. Once created, you can manually edit the file to update settings or use `swa init` to make updates.

## View configuration

The Static Webs CLI provides a `--print-config` option so you can review your current configuration.

Here's an example of what that output looks like when run on a new project with default settings.

```azstatic-cli
swa --print-config

Options:
 - port: 4280
 - host: localhost
 - apiPort: 7071
 - appLocation: .
 - apiLocation: <undefined>
 - outputLocation: .
 - swaConfigLocation: <undefined>
 - ssl: false
 - sslCert: <undefined>
 - sslKey: <undefined>
 - appBuildCommand: <undefined>
 - apiBuildCommand: <undefined>
 - run: <undefined>
 - verbose: log
 - serverTimeout: 60
 - open: false
 - githubActionWorkflowLocation: <undefined>
 - env: preview
 - appName: <undefined>
 - dryRun: false
 - subscriptionId: <undefined>
 - resourceGroupName: <undefined>
 - tenantId: <undefined>
 - clientId: <undefined>
 - clientSecret: <undefined>
 - useKeychain: true
 - clearCredentials: false
 - config: swa-cli.config.json
 - printConfig: true
```

Running `swa --print-config` provide's the current configuration defaults.

> [!NOTE]
> If the project has not yet defined a configuration file, this automatically triggers the `swa init` workflow to help you create one.

## Validate configuration

You can validate the *swa-cli.config.json* file against the following schema: https://aka.ms/azure/static-web-apps-cli/schema
