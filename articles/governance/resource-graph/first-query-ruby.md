---
title: "Quickstart: Your first Ruby query"
description: In this quickstart, you follow the steps to enable the Resource Graph gem for Ruby and run your first query.
ms.date: 07/09/2021
ms.topic: quickstart
---
# Quickstart: Run your first Resource Graph query using Ruby

The first step to using Azure Resource Graph is to check that the required gems for Ruby are
installed. This quickstart walks you through the process of adding the gems to your Ruby
installation.

At the end of this process, you'll have added the gems to your Ruby installation and run your first
Resource Graph query.

## Prerequisites

- If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/)
  account before you begin.
- An Azure service principal, including the _clientId_ and _clientSecret_.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

## Create the Resource Graph project

To enable Ruby to query Azure Resource Graph, the gem must be added to the `Gemfile`. This gem works
wherever Ruby can be used, including with [Azure Cloud Shell](https://shell.azure.com),
[bash on Windows 10](/windows/wsl/install-win10), or locally installed.

1. Check that the latest Ruby is installed (at least **2.7.1**). If it isn't yet installed, download
   it at [Ruby-Lang.org](https://www.ruby-lang.org/en/downloads/).

1. In your Ruby environment of choice, initialize a bundle in a new project folder:

   ```bash
   # Initialize a bundle to create a new Gemfile
   bundle init
   ```

1. Update your `Gemfile` with the gems needed for Azure Resource Graph. The updated file should look
   similar to this example:

   ```file
   # frozen_string_literal: true

   source "https://rubygems.org"

   git_source(:github) {|repo_name| "https://github.com/#{repo_name}" }

   # gem "rails"
   gem 'azure_mgmt_resourcegraph', '~> 0.17.2'
   ```

1. From the project folder, run `bundle install`. Confirm the gems were installed with
   `bundle list`.

1. In the same project folder, create `argQuery.rb` with the following code and save the updated
   file:

   ```ruby
   #!/usr/bin/env ruby

   require 'azure_mgmt_resourcegraph'
   ARG = Azure::ResourceGraph::Profiles::Latest::Mgmt

   # Get arguments and set options
   options = {
       tenant_id: ARGV[0],
       client_id: ARGV[1],
       client_secret: ARGV[2],
       subscription_id: ARGV[3]
   }

   # Create Resource Graph client from options
   argClient = ARG::Client.new(options)

   # Create Resource Graph QueryRequest for subscription with query
   query_request = ARGModels::QueryRequest.new.tap do |qr|
       qr.subscriptions = [ARGV[3]]
       qr.query = ARGV[4]
   end

   # Get the resources from Resource Graph
   response = argClient.resources(query_request)

   # Convert data to JSON and output
   puts response.data.to_json
   ```

## Run your first Resource Graph query

With the Ruby script saved and ready to use, it's time to try out a simple Resource Graph query. The
query returns the first five Azure resources with the **Name** and **Resource Type** of each
resource.

In each call to `argQuery`, there are variables that are used that you need to replace with your own
values:

- `{tenantId}` - Replace with your tenant ID
- `{clientId}` - Replace with the client ID of your service principal
- `{clientSecret}` - Replace with the client secret of your service principal
- `{subscriptionId}` - Replace with your subscription ID

1. Change directories to the project folder where you created the `Gemfile` and `argClient.rb`
   files.

1. Run your first Azure Resource Graph query using the gems and the `resources` method:

   ```bash
   ruby argQuery.rb "{tenantId}" "{clientId}" "{clientSecret}" "{subscriptionId}" "Resources | project name, type | limit 5"
   ```

   > [!NOTE]
   > As this query example does not provide a sort modifier such as `order by`, running this query
   > multiple times is likely to yield a different set of resources per request.

1. Change the final parameter to `argQuery.rb` and change the query to `order by` the **Name**
   property:

   ```bash
   ruby argQuery.rb "{tenantId}" "{clientId}" "{clientSecret}" "{subscriptionId}" "Resources | project name, type | limit 5 | order by name asc"
   ```

   > [!NOTE]
   > Just as with the first query, running this query multiple times is likely to yield a different
   > set of resources per request. The order of the query commands is important. In this example,
   > the `order by` comes after the `limit`. This command order first limits the query results and
   > then orders them.

1. Change the final parameter to `argQuery.rb` and change the query to first `order by` the **Name**
   property and then `limit` to the top five results:

   ```bash
   ruby argQuery.rb "{tenantId}" "{clientId}" "{clientSecret}" "{subscriptionId}" "Resources | project name, type | order by name asc | limit 5"
   ```

When the final query is run several times, assuming that nothing in your environment is changing,
the results returned are consistent and ordered by the **Name** property, but still limited to the
top five results.

## Clean up resources

If you wish to remove the installed gems from your Ruby environment, you can do so by using
the following command:

```bash
# Remove the installed gems from the Ruby environment
gem uninstall azure_mgmt_resourcegraph
```

> [!NOTE]
> The gem `azure_mgmt_resourcegraph` has dependencies such as `ms_rest` and `ms_rest_azure` that may
> have also been installed depending on your environment. You may uninstall these gems also if no
> longer needed.

## Next steps

In this quickstart, you've added the Resource Graph gems to your Ruby environment and run your first
query. To learn more about the Resource Graph language, continue to the query language details page.

> [!div class="nextstepaction"]
> [Get more information about the query language](./concepts/query-language.md)
