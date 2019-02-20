---
author: spelluru
ms.service: service-bus
ms.topic: include
ms.date: 11/09/2018	
ms.author: spelluru
---
## Create a Ruby application
For instructions, see [Create a Ruby Application on Azure](../articles/virtual-machines/linux/classic/ruby-rails-web-app.md).

## Configure Your application to Use Service Bus
To use Service Bus, download and use the Azure Ruby package, which includes a set of convenience libraries that communicate with the storage REST services.

### Use RubyGems to obtain the package
1. Use a command-line interface such as **PowerShell** (Windows), **Terminal** (Mac), or **Bash** (Unix).
2. Type "gem install azure" in the command window to install the gem and dependencies.

### Import the package
Using your favorite text editor, add the following to the top of the Ruby file in which you intend to use storage:

```ruby
require "azure"
```

## Set up a Service Bus connection
Use the following code to set the values of namespace, name of the key, key, signer and host:

```ruby
Azure.configure do |config|
  config.sb_namespace = '<your azure service bus namespace>'
  config.sb_sas_key_name = '<your azure service bus access keyname>'
  config.sb_sas_key = '<your azure service bus access key>'
end
signer = Azure::ServiceBus::Auth::SharedAccessSigner.new
sb_host = "https://#{Azure.sb_namespace}.servicebus.windows.net"
```

Set the namespace value to the value you created rather than the entire URL. For example, use **"yourexamplenamespace"**, not "yourexamplenamespace.servicebus.windows.net".
