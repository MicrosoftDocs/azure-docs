---
title: Configure the Azure Static Web Apps CLI
description: Configure the Azure Static Web Apps CLI
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  conceptual
ms.date: 09/30/2022
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
- If options are loaded from a config file, then command line options are ignored. For example, if you run `swa start app --ssl`, the `ssl=true` option is not be picked up by the CLI.

## Configuration file example

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

## Initialize a configuration file

Use `swa init` to kickstart the workflow to create a configuration file for a new or existing project. If the project exists, `swa init` tries to guess the configuration settings for you.

By default, the process creates these settings in a *swa-cli.config.json* in the current working directory of your project. This directory is the default file name and location used by `swa` when searching for project configuration values.

```azstatic-cli
swa --config <PATH>
```

If the file contains only one named configuration, then it is used by default. If multiple configurations are defined, you need to specify the one to use as an option.

```azstatic-cli
swa --config-name
```

When the configuration file option is used, the settings are stored in JSON format. Once created, you can manually edit the file to update settings or use `swa init` to make updates.

## View configuration

The Static Webs CLI provides a `--print-config` option so you can determine resolved options for your current setup.

Here is an example of what that output looks like when run on a new project with default settings.

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

The swa-cli.config.json file can be validated against the following schema: https://aka.ms/azure/static-web-apps-cli/schema
