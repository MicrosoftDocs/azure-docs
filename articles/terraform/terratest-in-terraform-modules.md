---
title: Test Terraform modules in Azure by using Terratest
description: Learn how to use Terratest to test your Terraform modules.
services: terraform
ms.service: azure
keywords: terraform, devops, storage account, azure, terratest, unit test, integration test
author: tomarchermsft
manager: jeconnoc
ms.author: tarcher
ms.topic: tutorial
ms.date: 03/19/2019

---

# Test Terraform modules in Azure by using Terratest

> [!NOTE]
> The sample code in this article does not work with version 0.12 (and greater).

You can use Azure Terraform modules to create reusable, composable, and testable components. Terraform modules incorporate encapsulation that's useful in implementing infrastructure as code processes.

It's important to implement quality assurance when you create Terraform modules. Unfortunately, limited documentation is available to explain how to author unit tests and integration tests in Terraform modules. This tutorial introduces a testing infrastructure and best practices that we adopted when we built our [Azure Terraform modules](https://registry.terraform.io/browse?provider=azurerm).

We looked at all the most popular testing infrastructures and chose [Terratest](https://github.com/gruntwork-io/terratest) to use for testing our Terraform modules. Terratest is implemented as a Go library. Terratest provides a collection of helper functions and patterns for common infrastructure testing tasks, like making HTTP requests and using SSH to access a specific virtual machine. The following list describes some of the major advantages of using Terratest:

- **It provides convenient helpers to check infrastructure**. This feature is useful when you want to verify your real infrastructure in the real environment.
- **The folder structure is clearly organized**. Your test cases are organized clearly and follow the [standard Terraform module folder structure](https://www.terraform.io/docs/modules/create.html#standard-module-structure).
- **All test cases are written in Go**. Most developers who use Terraform are Go developers. If you're a Go developer, you don't have to learn another programming language to use Terratest. Also, the only dependencies that are required for you to run test cases in Terratest are Go and Terraform.
- **The infrastructure is highly extensible**. You can extend additional functions on top of Terratest, including Azure-specific features.

## Prerequisites

This hands-on article is platform-independent. You can run the code examples that we use in this article on Windows, Linux, or MacOS. 

Before you begin, install the following software:

- **Go programming language**: Terraform test cases are written in [Go](https://golang.org/dl/).
- **dep**: [dep](https://github.com/golang/dep#installation) is a dependency management tool for Go.
- **Azure CLI**: The [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) is a command-line tool you can use to manage Azure resources. (Terraform supports authenticating to Azure through a service principal or [via the Azure CLI](https://www.terraform.io/docs/providers/azurerm/authenticating_via_azure_cli.html).)
- **mage**: We use the [mage executable](https://github.com/magefile/mage/releases) to show you how to simplify running Terratest cases. 

## Create a static webpage module

In this tutorial, you create a Terraform module that provisions a static webpage by uploading a single HTML file to an Azure Storage blob. This module gives users from around the world access to the webpage through a URL that the module returns.

> [!NOTE]
> Create all files that are described in this section under your [GOPATH](https://github.com/golang/go/wiki/SettingGOPATH) location.

First, create a new folder named `staticwebpage` under your GoPath `src` folder. The overall folder structure of this tutorial is shown in the following example. Files marked with an asterisk `(*)` are the primary focus in this section.

```
 📁 GoPath/src/staticwebpage
   ├ 📁 examples
   │   └ 📁 hello-world
   │       ├ 📄 index.html
   │       └ 📄 main.tf
   ├ 📁 test
   │   ├ 📁 fixtures
   │   │   └ 📁 storage-account-name
   │   │       ├ 📄 empty.html
   │   │       └ 📄 main.tf
   │   ├ 📄 hello_world_example_test.go
   │   └ 📄 storage_account_name_unit_test.go
   ├ 📄 main.tf      (*)
   ├ 📄 outputs.tf   (*)
   └ 📄 variables.tf (*)
```

The static webpage module accepts three inputs. The inputs are declared in `./variables.tf`:

```hcl
variable "location" {
  description = "The Azure region in which to create all resources."
}

variable "website_name" {
  description = "The website name to use to create related resources in Azure."
}

variable "html_path" {
  description = "The file path of the static home page HTML in your local file system."
  default     = "index.html"
}
```

As we mentioned earlier in the article, this module also outputs a URL that's declared in `./outputs.tf`:

```hcl
output "homepage_url" {
  value = "${azurerm_storage_blob.homepage.url}"
}
```

The main logic of the module provisions four resources:
- **resource group**: The name of the resource group is the `website_name` input appended by `-staging-rg`.
- **storage account**: The name of the storage account is the `website_name` input appended by `data001`. To adhere to the name limitations of the storage account, the module removes all special characters and uses lowercase letters in the entire storage account name.
- **fixed name container**: The container is named `wwwroot` and is created in the storage account.
- **single HTML file**: The HTML file is read from the `html_path` input and uploaded to `wwwroot/index.html`.

The static webpage module logic is implemented in `./main.tf`:

```hcl
resource "azurerm_resource_group" "main" {
  name     = "${var.website_name}-staging-rg"
  location = "${var.location}"
}

resource "azurerm_storage_account" "main" {
  name                     = "${lower(replace(var.website_name, "/[[:^alnum:]]/", ""))}data001"
  resource_group_name      = "${azurerm_resource_group.main.name}"
  location                 = "${azurerm_resource_group.main.location}"
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_container" "main" {
  name                  = "wwwroot"
  resource_group_name   = "${azurerm_resource_group.main.name}"
  storage_account_name  = "${azurerm_storage_account.main.name}"
  container_access_type = "blob"
}

resource "azurerm_storage_blob" "homepage" {
  name                   = "index.html"
  resource_group_name    = "${azurerm_resource_group.main.name}"
  storage_account_name   = "${azurerm_storage_account.main.name}"
  storage_container_name = "${azurerm_storage_container.main.name}"
  source                 = "${var.html_path}"
  type                   = "block"
  content_type           = "text/html"
}
```

### Unit test

Terratest is designed for integration tests. For that purpose, Terratest provisions real resources in a real environment. Sometimes, integration test jobs can become exceptionally large, especially when you have a large number of resources to provision. The logic that converts storage account names that we refer to in the preceding section is a good example. 

But, we don't really need to provision any resources. We only want to make sure that the naming conversion logic is correct. Thanks to the flexibility of Terratest, we can use unit tests. Unit tests are local running test cases (although internet access is required). Unit test cases execute `terraform init` and `terraform plan` commands to parse the output of `terraform plan` and look for the attribute values to compare.

The rest of this section describes how we use Terratest to implement a unit test to make sure that the logic used to convert storage account names is correct. We are interested only in the files marked with an asterisk `(*)`.

```
 📁 GoPath/src/staticwebpage
   ├ 📁 examples
   │   └ 📁 hello-world
   │       ├ 📄 index.html
   │       └ 📄 main.tf
   ├ 📁 test
   │   ├ 📁 fixtures
   │   │   └ 📁 storage-account-name
   │   │       ├ 📄 empty.html                (*)
   │   │       └ 📄 main.tf                   (*)
   │   ├ 📄 hello_world_example_test.go
   │   └ 📄 storage_account_name_unit_test.go (*)
   ├ 📄 main.tf
   ├ 📄 outputs.tf
   └ 📄 variables.tf
```

First, we use an empty HTML file named `./test/fixtures/storage-account-name/empty.html` as a placeholder.

The file  `./test/fixtures/storage-account-name/main.tf` is the test case frame. It accepts one input, `website_name`, which is also the input of the unit tests. The logic is shown here:

```hcl
variable "website_name" {
  description = "The name of your static website."
}

module "staticwebpage" {
  source       = "../../../"
  location     = "West US"
  website_name = "${var.website_name}"
  html_path    = "empty.html"
}
```

The major component is the implementation of the unit tests in `./test/storage_account_name_unit_test.go`.

Go developers probably will notice that the unit test matches the signature of a classic Go test function by accepting an argument of type `*testing.T`.

In the body of the unit test, we have a total of five cases that are defined in variable `testCases` (`key` as input, and `value` as expected output). For each unit test case, we first run `terraform init` and target the test fixture folder (`./test/fixtures/storage-account-name/`). 

Next, a `terraform plan` command that uses specific test case input (take a look at the `website_name` definition in `tfOptions`) saves the result to `./test/fixtures/storage-account-name/terraform.tfplan` (not listed in the overall folder structure).

This result file is parsed to a code-readable structure by using the official Terraform plan parser.

Now, we look for the attributes we're interested in (in this case, the `name` of the `azurerm_storage_account`) and compare the results with the expected output:

```go
package test

import (
	"os"
	"path"
	"testing"

	"github.com/gruntwork-io/terratest/modules/terraform"
	terraformCore "github.com/hashicorp/terraform/terraform"
)

func TestUT_StorageAccountName(t *testing.T) {
	t.Parallel()

	// Test cases for storage account name conversion logic
	testCases := map[string]string{
		"TestWebsiteName": "testwebsitenamedata001",
		"ALLCAPS":         "allcapsdata001",
		"S_p-e(c)i.a_l":   "specialdata001",
		"A1phaNum321":     "a1phanum321data001",
		"E5e-y7h_ng":      "e5ey7hngdata001",
	}

	for input, expected := range testCases {
		// Specify the test case folder and "-var" options
		tfOptions := &terraform.Options{
			TerraformDir: "./fixtures/storage-account-name",
			Vars: map[string]interface{}{
				"website_name": input,
			},
		}

		// Terraform init and plan only
		tfPlanOutput := "terraform.tfplan"
		terraform.Init(t, tfOptions)
		terraform.RunTerraformCommand(t, tfOptions, terraform.FormatArgs(tfOptions.Vars, "plan", "-out="+tfPlanOutput)...)

		// Read and parse the plan output
		f, err := os.Open(path.Join(tfOptions.TerraformDir, tfPlanOutput))
		if err != nil {
			t.Fatal(err)
		}
		defer f.Close()
		plan, err := terraformCore.ReadPlan(f)
		if err != nil {
			t.Fatal(err)
		}

		// Validate the test result
		for _, mod := range plan.Diff.Modules {
			if len(mod.Path) == 2 && mod.Path[0] == "root" && mod.Path[1] == "staticwebpage" {
				actual := mod.Resources["azurerm_storage_account.main"].Attributes["name"].New
				if actual != expected {
					t.Fatalf("Expect %v, but found %v", expected, actual)
				}
			}
		}
	}
}
```

To run the unit tests, complete the following steps on the command line:

```shell
$ cd [Your GoPath]/src/staticwebpage
GoPath/src/staticwebpage$ dep init    # Run only once for this folder
GoPath/src/staticwebpage$ dep ensure  # Required to run if you imported new packages in test cases
GoPath/src/staticwebpage$ cd test
GoPath/src/staticwebpage/test$ go fmt
GoPath/src/staticwebpage/test$ az login    # Required when no service principal environment variables are present
GoPath/src/staticwebpage/test$ go test -run TestUT_StorageAccountName
```

The traditional Go test result returns in about a minute.

### Integration test

In contrast to unit tests, integration tests must provision resources to a real environment for an end-to-end perspective. Terratest does a good job with this kind of task. 

Best practices for Terraform modules include installing the `examples` folder. The `examples` folder contains some end-to-end samples. To avoid working with real data, why not test those samples as integration tests? In this section, we focus on the three files that are marked with an asterisk `(*)` in the following folder structure:

```
 📁 GoPath/src/staticwebpage
   ├ 📁 examples
   │   └ 📁 hello-world
   │       ├ 📄 index.html              (*)
   │       └ 📄 main.tf                 (*)
   ├ 📁 test
   │   ├ 📁 fixtures
   │   │   └ 📁 storage-account-name
   │   │       ├ 📄 empty.html
   │   │       └ 📄 main.tf
   │   ├ 📄 hello_world_example_test.go (*)
   │   └ 📄 storage_account_name_unit_test.go
   ├ 📄 main.tf
   ├ 📄 outputs.tf
   └ 📄 variables.tf
```

Let's start with the samples. A new sample folder named `hello-world/` is created in the `./examples/` folder. Here, we provide a simple HTML page to be uploaded: `./examples/hello-world/index.html`.

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Hello World</title>
</head>
<body>
    <h1>Hi, Terraform Module</h1>
    <p>This is a sample web page to demonstrate Terratest.</p>
</body>
</html>
```

The Terraform sample `./examples/hello-world/main.tf` is similar to the one shown in the unit test. There's one significant difference: the sample also prints out the URL of the uploaded HTML as a webpage named `homepage`.

```hcl
variable "website_name" {
  description = "The name of your static website."
  default     = "Hello-World"
}

module "staticwebpage" {
  source       = "../../"
  location     = "West US"
  website_name = "${var.website_name}"
}

output "homepage" {
  value = "${module.staticwebpage.homepage_url}"
}
```

We use Terratest and classic Go test functions again in the integration test file `./test/hello_world_example_test.go`.

Unlike unit tests, integration tests create actual resources in Azure. That's why you need to be careful to avoid naming conflicts. (Pay special attention to some globally unique names like storage account names.) Therefore, the first step of the testing logic is to generate a randomized `websiteName` by using the `UniqueId()` function provided by Terratest. This function generates a random name that has lowercase letters, uppercase letters, or numbers. `tfOptions` makes all Terraform commands that target the `./examples/hello-world/` folder. It also makes sure that `website_name` is set to the randomized `websiteName`.

Then, `terraform init`, `terraform apply`, and `terraform output` are executed, one by one. We use another helper function, `HttpGetWithCustomValidation()`, which is provided by Terratest. We use the helper function to make sure that HTML is uploaded to the output `homepage` URL that's returned by `terraform output`. We compare the HTTP GET status code with `200` and look for some keywords in the HTML content. Finally, `terraform destroy` is "promised" to be executed by leveraging the `defer` feature of Go.

```go
package test

import (
	"fmt"
	"strings"
	"testing"

	"github.com/gruntwork-io/terratest/modules/http-helper"
	"github.com/gruntwork-io/terratest/modules/random"
	"github.com/gruntwork-io/terratest/modules/terraform"
)

func TestIT_HelloWorldExample(t *testing.T) {
	t.Parallel()

	// Generate a random website name to prevent a naming conflict
	uniqueID := random.UniqueId()
	websiteName := fmt.Sprintf("Hello-World-%s", uniqueID)

	// Specify the test case folder and "-var" options
	tfOptions := &terraform.Options{
		TerraformDir: "../examples/hello-world",
		Vars: map[string]interface{}{
			"website_name": websiteName,
		},
	}

	// Terraform init, apply, output, and destroy
	defer terraform.Destroy(t, tfOptions)
	terraform.InitAndApply(t, tfOptions)
	homepage := terraform.Output(t, tfOptions, "homepage")

	// Validate the provisioned webpage
	http_helper.HttpGetWithCustomValidation(t, homepage, func(status int, content string) bool {
		return status == 200 &&
			strings.Contains(content, "Hi, Terraform Module") &&
			strings.Contains(content, "This is a sample web page to demonstrate Terratest.")
	})
}
```

To run the integration tests, complete the following steps on the command line:

```shell
$ cd [Your GoPath]/src/staticwebpage
GoPath/src/staticwebpage$ dep init    # Run only once for this folder
GoPath/src/staticwebpage$ dep ensure  # Required to run if you imported new packages in test cases
GoPath/src/staticwebpage$ cd test
GoPath/src/staticwebpage/test$ go fmt
GoPath/src/staticwebpage/test$ az login    # Required when no service principal environment variables are present
GoPath/src/staticwebpage/test$ go test -run TestIT_HelloWorldExample
```

The traditional Go test result returns in about two minutes. You could also run both unit tests and integration tests by executing these commands:

```shell
GoPath/src/staticwebpage/test$ go fmt
GoPath/src/staticwebpage/test$ go test
```

Integration tests take much longer than unit tests (two minutes for one integration case compared to one minute for five unit cases). But it's your decision whether to use unit tests or integration tests in a scenario. Typically, we prefer to use unit tests for complex logic by using Terraform HCL functions. We usually use integration tests for the end-to-end perspective of a user.

## Use mage to simplify running Terratest cases 

Running test cases in Azure Cloud Shell isn't an easy task. You have to go to different directories and execute different commands. To avoid using Cloud Shell, we introduce the build system in our project. In this section, we use a Go build system, mage, for the job.

The only thing required by mage is `magefile.go` in your project's root directory (marked with `(+)` in the following example):

```
 📁 GoPath/src/staticwebpage
   ├ 📁 examples
   │   └ 📁 hello-world
   │       ├ 📄 index.html
   │       └ 📄 main.tf
   ├ 📁 test
   │   ├ 📁 fixtures
   │   │   └ 📁 storage-account-name
   │   │       ├ 📄 empty.html
   │   │       └ 📄 main.tf
   │   ├ 📄 hello_world_example_test.go
   │   └ 📄 storage_account_name_unit_test.go
   ├ 📄 magefile.go (+)
   ├ 📄 main.tf
   ├ 📄 outputs.tf
   └ 📄 variables.tf
```

Here's an example of `./magefile.go`. In this build script, written in Go, we implement five build steps:
- `Clean`: The step removes all generated and temporary files that are generated during test executions.
- `Format`: The step runs `terraform fmt` and `go fmt` to format your code base.
- `Unit`: The step runs all unit tests (by using the function name convention `TestUT_*`) under the `./test/` folder.
- `Integration`: The step is similar to `Unit`, but instead of unit tests, it executes integration tests (`TestIT_*`).
- `Full`: The step runs `Clean`, `Format`, `Unit`, and `Integration` in sequence.

```go
// +build mage

// Build a script to format and run tests of a Terraform module project
package main

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/magefile/mage/mg"
	"github.com/magefile/mage/sh"
)

// The default target when the command executes `mage` in Cloud Shell
var Default = Full

// A build step that runs Clean, Format, Unit and Integration in sequence
func Full() {
	mg.Deps(Unit)
	mg.Deps(Integration)
}

// A build step that runs unit tests
func Unit() error {
	mg.Deps(Clean)
	mg.Deps(Format)
	fmt.Println("Running unit tests...")
	return sh.RunV("go", "test", "./test/", "-run", "TestUT_", "-v")
}

// A build step that runs integration tests
func Integration() error {
	mg.Deps(Clean)
	mg.Deps(Format)
	fmt.Println("Running integration tests...")
	return sh.RunV("go", "test", "./test/", "-run", "TestIT_", "-v")
}

// A build step that formats both Terraform code and Go code
func Format() error {
	fmt.Println("Formatting...")
	if err := sh.RunV("terraform", "fmt", "."); err != nil {
		return err
	}
	return sh.RunV("go", "fmt", "./test/")
}

// A build step that removes temporary build and test files
func Clean() error {
	fmt.Println("Cleaning...")
	return filepath.Walk(".", func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() && info.Name() == "vendor" {
			return filepath.SkipDir
		}
		if info.IsDir() && info.Name() == ".terraform" {
			os.RemoveAll(path)
			fmt.Printf("Removed \"%v\"\n", path)
			return filepath.SkipDir
		}
		if !info.IsDir() && (info.Name() == "terraform.tfstate" ||
			info.Name() == "terraform.tfplan" ||
			info.Name() == "terraform.tfstate.backup") {
			os.Remove(path)
			fmt.Printf("Removed \"%v\"\n", path)
		}
		return nil
	})
}
```

You can use the following commands to execute a full test suite. The code is similar to the running steps we used in an earlier section. 

```shell
$ cd [Your GoPath]/src/staticwebpage
GoPath/src/staticwebpage$ dep init    # Run only once for this folder
GoPath/src/staticwebpage$ dep ensure  # Required to run if you imported new packages in magefile or test cases
GoPath/src/staticwebpage$ go fmt      # Only required when you change the magefile
GoPath/src/staticwebpage$ az login    # Required when no service principal environment variables are present
GoPath/src/staticwebpage$ mage
```

You can replace the last command line with additional mage steps. For example, you can use `mage unit` or `mage clean`. It's a good idea to embed `dep` commands and `az login` in the magefile. We don't show the code here. 

With mage, you could also share the steps by using the Go package system. In that case, you can simplify magefiles across all your modules by referencing only a common implementation and declaring dependencies (`mg.Deps()`).

**Optional: Set service principal environment variables to run acceptance tests**
 
Instead of executing `az login` before tests, you can complete Azure authentication by setting the service principal environment variables. Terraform publishes a [list of environment variable names](https://www.terraform.io/docs/providers/azurerm/index.html#testing). (Only the first four of these environment variables are required.) Terraform also publishes detailed instructions that explain how to [obtain the value of these environment variables](https://www.terraform.io/docs/providers/azurerm/authenticating_via_service_principal.html).

## Next steps

* For more information about Terratest, see the [Terratest GitHub page](https://github.com/gruntwork-io/terratest).
* For information about mage, see the [mage GitHub page](https://github.com/magefile/mage) and the [mage website](https://magefile.org/).
