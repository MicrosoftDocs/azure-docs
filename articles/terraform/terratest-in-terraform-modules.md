---

title: 'Test Terraform modules in Azure using Terratest'
description: Learn how to use Terratest to test your Terraform modules.
services: terraform
ms.service: terraform
keywords: terraform, devops, storage account, azure, terratest, unit test, integration test
author: JunyiYi
manager: jeconnoc
ms.author: junyi
ms.topic: tutorial
ms.date: 10/19/2018

---

# Test Terraform modules in Azure using Terratest

Terraform modules are used to create reusable, composable, and testable components. They incorporate encapsulation in the world of "infrastructure as code".

As with other software components, quality assurance plays an important role in Terraform modules. Unfortunately, there is little available documentation explaining how to author unit tests and integration tests in Terraform modules. This tutorial introduces a testing infrastructure and best practices we adopted while building our [Azure Terraform modules](https://registry.terraform.io/browse?provider=azurerm).

After considering all of the most popular testing infrastructures, we chose to use [Terratest](https://github.com/gruntwork-io/terratest). Terratest is implemented as a Go library. It provides a collection of helper functions and patterns for common infrastructure testing tasks, such as making HTTP requests and SSH to a particular virtual machine. Some of the major advantages of Terratest are:

- **It provides convenient helpers to check infrastructure.** This feature is useful when you want to verify your real infrastructure in the real environment.
- **Folder structure is clearly organized.** Your test cases will be organized clearly and will follow the [standard Terraform module folder structure](https://www.terraform.io/docs/modules/create.html#standard-module-structure).
- **All test cases are written in Go.** Since most of the Terraform developers are already Go developers, using Terratest eliminates the need to learn yet another programming language. Also, the only dependencies necessary to run test cases in Terratest are Go and Terraform.
- **This infrastructure is highly extensible.** It is not difficult to extend additional functions on top of Terratest, such as Azure-specific features.

## Prerequisites

This hands-on guide is platform-independent; it can be run it on Windows, Linux, or MacOS. Before proceeding, install the following software:

- **The Go Programming language**: The Terraform test cases are written in [Go](https://golang.org/dl/).
- **dep**: [dep](https://github.com/golang/dep#installation) is a dependency management tool for Go.
- **Azure CLI**: The [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) is a command-line tool for managing Azure resources. (Terraform supports authenticating to Azure through a Service Principal or [via the Azure CLI](https://www.terraform.io/docs/providers/azurerm/authenticating_via_azure_cli.html).)
- **mage**: We will be using the [mage executable](https://github.com/magefile/mage/releases) to learn how to sinplify running your Terratest cases. 

## Create a static webpage module

In this tutorial, you will create a Terraform module that will provision a static webpage by uploading a single HTML file to Azure storage blob. This module will enable users from all over the world to access this webpage through a URL returned by the module.

> [!NOTE]
> All files described in this section should be created under your [GOPATH](https://github.com/golang/go/wiki/SettingGOPATH).

First, create a new folder named `staticwebpage` under the `src` folder of your GoPath. The overall folder structure of this tutorial is depicted below. (Files marked with an asterisk `(*)` are the major focus in this section.)

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

The static webpage module accepts three inputs, which are declared in `./variables.tf`:

```hcl
variable "location" {
  description = "The Azure region in which all resources will be created."
}

variable "website_name" {
  description = "The website name which will be used to create a bunch of related resources in Azure."
}

variable "html_path" {
  description = "The file path of the static homepage HTML in your local filesystem."
  default     = "index.html"
}
```

As mentioned before, this module will also output a URL declared in `./outputs.tf`:

```hcl
output "homepage_url" {
  value = "${azurerm_storage_blob.homepage.url}"
}
```

This brings us to the main logic of this module. In total, it will provision four resources:
- A resource group whose name is the `website_name` input appended by `-staging-rg`.
- A storage account whose name is the `website_name` input appended by `data001`. But in order to adhere to the name limitations of storage account, the module will remove all special characters and lowercase the whole name.
- A fixed named container `wwwroot` created in the storage account above.
- A single HTML file read from the `html_path` input and uploaded to `wwwroot/index.html`.

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

Terratest is traditionally a tool designed for integration tests--which means it will provision real resources in a real environment. Sometimes such jobs can become exceptionally large, especially when you have tons of resources to be provisioned. The storage account naming conversion logic described in the previous section is a good example: we don't really need to provision any resources--we just want to make sure the naming conversion logic is correct.

Thanks to the flexibility of Terratest, this is easily accomplished via the use of unit tests. Unit tests are local running test cases (although internet access is still required) by just executing `terraform init` and `terraform plan` commands, the unit test cases will parse the output of `terraform plan` and look for the attribute values to be compared.

The rest of this section will describe how we use Terratest to implement a unit test to make sure storage account naming conversion logic is correct. We will be only interested in the files marked with an asterisk `(*)`.

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

First, an empty HTML file `./test/fixtures/storage-account-name/empty.html` is just a placeholder.

The file  `./test/fixtures/storage-account-name/main.tf` is the test case skeleton. It accepts one input `website_name`, which is also the input of the unit tests. Its logic is displayed here:

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

Finally, the major component is the implementation of the unit tests: `./test/storage_account_name_unit_test.go`

If you are a Go developer, you will recognize that it matches the signature of a classic Go test function by accepting an argument of type `*testing.T`.

In the body of the unit test, we have a total of five cases defined in variable `testCases` (key as input, while value as expected output). For each unit test case, we will first run `terraform init` targeting the test fixture folder (`./test/fixtures/storage-account-name/`). 

Following that, a `terraform plan` command with specific test case input (take a look at the `website_name` definition in `tfOptions`) will save the result to `./test/fixtures/storage-account-name/terraform.tfplan` (which is not listed in the overall folder structure).

Next, this result file will be parsed to a code-readable structure using the official Terraform plan parser.

We will now look for the attributes we are interested in (in this case the `name` of the `azurerm_storage_account`), and compare them with the expected output.

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
		// Specify test case folder and "-var" options
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

To run the unit tests, you will need to complete the following steps in command line.

```shell
$ cd [Your GoPath]/src/staticwebpage
GoPath/src/staticwebpage$ dep init    # Run only once for this folder
GoPath/src/staticwebpage$ dep ensure  # Required to run if you imported new packages in test cases
GoPath/src/staticwebpage$ cd test
GoPath/src/staticwebpage/test$ go fmt
GoPath/src/staticwebpage/test$ az login    # Required when no service principal environment variables present
GoPath/src/staticwebpage/test$ go test -run TestUT_StorageAccountName
```

You will see the traditional Go test result after about one minute.

### Integration test

In contrast to unit tests, integration tests are required to provision resources to a real environment from the end-to-end perspective. Terratest does a good job on such things. Since the best practice of Terraform module also recommends the `examples` folder containing some end-to-end samples, why not just test those samples as integration tests? In this section, we will focus on three files, each marked with an asterisk `(*)`.

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

Let's first start with the samples. A new sample folder called `hello-world/` is created in the `./examples/` folder. Here we provide a simple HTML page to be uploaded `./examples/hello-world/index.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Hello World</title>
</head>
<body>
    <h1>Hi, Terraform Module</h1>
    <p>This is a sample web page to demostrate Terratest.</p>
</body>
</html>
```

The Terraform sample `./examples/hello-world/main.tf` is similar to the one shown in unit test, with only one large difference: it also prints out the URL of the uploaded HTML named as `homepage`.

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

Terratest and classic Go test function appear again in the integration test file `./test/hello_world_example_test.go`.

Unlike unit tests, integration tests will create actual resources in Azure, and that is why you need to be careful to avoid name conflicts. (Pay special attention to some globally unique names like storage account name). Therefore, the first step of the testing logic is to generate a randomized `websiteName` using the `UniqueId()` function provided by TerraTest. This function will generate a random name containing lower case letters, upper case letters, or numbers. `tfOptions` makes all Terraform commands targeting the `./examples/hello-world/` folder, and also makes sure `website_name` is set to the randomized `websiteName`.

Then, `terraform init`, `terraform apply`, and `terraform output` are executed, one by one. We used another helper function `HttpGetWithCustomValidation()` provided by Terratest to make sure that HTML is uploaded to the output `homepage` URL returned by `terraform output` by comparing the HTTP Get status code with `200` and looking for some keywords in the HTML content. Finally, `terraform destroy` is "promised" to be executed by leveraging the `defer` feature of Go.

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

	// Generate a random website name to prevent naming conflict
	uniqueID := random.UniqueId()
	websiteName := fmt.Sprintf("Hello-World-%s", uniqueID)

	// Specify test case folder and "-var" options
	tfOptions := &terraform.Options{
		TerraformDir: "../examples/hello-world",
		Vars: map[string]interface{}{
			"website_name": websiteName,
		},
	}

	// Terraform init, apply, output and destroy
	defer terraform.Destroy(t, tfOptions)
	terraform.InitAndApply(t, tfOptions)
	homepage := terraform.Output(t, tfOptions, "homepage")

	// Validate the provisioned webpage
	http_helper.HttpGetWithCustomValidation(t, homepage, func(status int, content string) bool {
		return status == 200 &&
			strings.Contains(content, "Hi, Terraform Module") &&
			strings.Contains(content, "This is a sample web page to demostrate Terratest.")
	})
}
```

To run the integration tests, you will need to complete the following steps in command line.

```shell
$ cd [Your GoPath]/src/staticwebpage
GoPath/src/staticwebpage$ dep init    # Run only once for this folder
GoPath/src/staticwebpage$ dep ensure  # Required to run if you imported new packages in test cases
GoPath/src/staticwebpage$ cd test
GoPath/src/staticwebpage/test$ go fmt
GoPath/src/staticwebpage/test$ az login    # Required when no service principal environment variables present
GoPath/src/staticwebpage/test$ go test -run TestIT_HelloWorldExample
```

You will see the traditional Go test result after about two minutes. Of course, you could also run both unit tests as well as integration tests by executing:

```shell
GoPath/src/staticwebpage/test$ go fmt
GoPath/src/staticwebpage/test$ go test
```

As you can tell, integration tests take much longer time than unit tests (two minutes for one integration case while one minute for five unit cases). But it is still your decision about when to use unit tests and when to leverage integration tests. Typically, we prefer to use unit tests for complex logic using Terraform HCL functions; while using integration test from the end-to-end perspective of a user.

## Use mage to simplify running Terratest cases 

As you have seen, running test cases in shell is not an easy task because you need to navigate to different directories and execute different commands. It is for this reason we introduce the build system in our project. In this section, we will use a Go build system mage to do the job.

The only thing required by mage is a `magefile.go` in your project's root directory (marked with `(+)` in the following figure).

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

Here is one example of `./magefile.go`. In this build script, written in Go, we implemented five build steps:
- `Clean`: this step will remove all generated/temporary files during test executions.
- `Format`: this step will run `terraform fmt` and `go fmt` to format your code base.
- `Unit`: this step will run all unit tests (using function name convention `TestUT_*`) under `./test/` folder.
- `Integration`: similar to `Unit`, but instead of unit tests, it executes integration tests (`TestIT_*`).
- `Full`: this step runs `Clean`, `Format`, `Unit', and `Integration`, in sequence.

```go
// +build mage

// Build script to format and run tests of a Terraform module project.
package main

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/magefile/mage/mg"
	"github.com/magefile/mage/sh"
)

// Default target when execute `mage` in shell
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

// A build step that removes temporary build/test files
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

Similar to the running steps before, you can use the following commands to execute a full test suite:

```shell
$ cd [Your GoPath]/src/staticwebpage
GoPath/src/staticwebpage$ dep init    # Run only once for this folder
GoPath/src/staticwebpage$ dep ensure  # Required to run if you imported new packages in magefile or test cases
GoPath/src/staticwebpage$ go fmt      # Only requied when you change the magefile
GoPath/src/staticwebpage$ az login    # Required when no service principal environment variables present
GoPath/src/staticwebpage$ mage
```

Feel free to replace the last command line with any mage steps, for instance `mage unit` or `mage clean`. Now you might think that there are still many command lines here, and it is a good idea to embed `dep` commands as well as `az login` into the magefile. But we will not show the code here. One further step of using mage is that the steps could be shared using the Go package system. So that magefiles across all your modules could be simplified by just referencing a common implementation and declaring dependencies (`mg.Deps()`).

> [!NOTE]
> **Option: Setting service principal environment variables to run acceptance tests**
> 
> Instead of executing `az login` before tests, you can accomplish Azure authentication by setting the service principal environment variables. Terraform publishes [a list of environment variable names](https://www.terraform.io/docs/providers/azurerm/index.html#testing). (Only the first four of these environment variables are required.) Terraform also publishes detailes instruction explaining how to [obtain the value of these environment variables.](https://www.terraform.io/docs/providers/azurerm/authenticating_via_service_principal.html)

## Next steps

For more information about Terratest, see [its GitHub page](https://github.com/gruntwork-io/terratest). You might find some useful information about mage in [its GitHub page](https://github.com/magefile/mage) and [its home page](https://magefile.org/).
