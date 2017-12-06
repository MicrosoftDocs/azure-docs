## Deployment customization

By default, when deploying from a .zip file, it is assumed that the package contains a ready-to-run app. You can enable the same build processes you get with continuous integration by adding the following to  app setting:

        SCM_DO_BUILD_DURING_DEPLOYMENT=true 

When using .zip deployment, this setting is assumed to be false; it defaults to true for continuous integration deployments.

When enabled, your deployment-related settings are respected. These settings can be set either as app settings or in a `.deployment` configuration file located in the root of your zip file. For more information, see [
Repository and deployment related settings](https://github.com/projectkudu/kudu/wiki/Configurable-settings#repository-and-deployment-related-settings) in the deployment reference.