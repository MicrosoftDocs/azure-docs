<properties 
	pageTitle="Machine Learning Sample: Color quantization using K-Means clustering | Azure" 
	description="A sample Azure Machine Learning experiment that evaluates using different K-Means clustering values for quantizing a color image." 
	services="machine-learning" 
	documentationCenter="" 
	authors="Garyericson" 
	manager="paulettm" 
	editor="cgronlun"/>

<tags 
	ms.service="machine-learning" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="12/10/2014" 
	ms.author="garye"/>


# Azure Machine Learning Sample: Color quantization using K-Means clustering

>[AZURE.NOTE]
>The [Sample Experiment] and [Sample Dataset] associated with this model are available in ML Studio. See below for more details.
[Sample Experiment]: #sample-experiment
[Sample Dataset]: #sample-dataset


##Problem description

[Color quantization](http://en.wikipedia.org/wiki/Color_quantization "Color quantization") is the process of reducing the number of distinct colors in an image hence, compressing it. Normally, the intent is to preserve the color appearance of the image as much as possible, while reducing the number of colors, whether for memory limitations or compression. 

##Data

In this sample experiment, we are assuming any given 24-bit RGB image has 256 x 256 x 256 possible colors. And sure, we can build standard color histograms based on these intensity values. But another approach is to explicitly quantize the image and *reduce* the number of colors to say, 16 or 64. This creates a substantially smaller space and (ideally) less noise and variance. For this, we passed the pixel data (each pixel as a dataset row) to our K-Means clustering Module. 

##Model

The model is created as shown in the image below:

![Model][image1]

We ran K-Means clustering with K=10 through 500 in 5 different branches. First we calculated the clusters and then aggregated the clustering to the mean of their pixels colors (using an R Script). 
Finally, we associated each pixel with the aggregated cluster color and sent the new image out in CSV format. Meanwhile, we also calculated the Root Mean Squared Difference of the new pixel colors with the original image and shown them in a R plot (using Execute R Script). 

##Results

We tested the outcome on different number of clusters (colors) as shown on the experiment model below. As you can see below, more clustering creates higher quality images with less compression:

||
------------ | ---------
**Original** | ![Original][image2a]
**K=10**     | ![K=10][image2b]
**K=20**     | ![K=20][image2c]
**K=50**     | ![K=50][image2d]
**K=100**    | ![K=100][image2e]
**K=500**    | ![K=500][image2f]


We have also measured the accuracy using Root Mean Squared Difference to the Original Image Colors which can be seen from the second output port of the "Execute R Script" Module:

![Output of Execute R Script module][image3]

As it's visible, the more color clusters, the more colors match the original images (better quality). 

##Code to convert images to CSV and reverse

In order to feed the images into ML Studio, we wrote a simple convertor code which can convert image files to a csv format that ML Studio can use, and also one which converts them back to an image. Please feel free to use the following code. In the future we are planning to add a module for reading in images as well. 

	using System;
	using System.Collections.Generic;
	using System.Linq;
	using System.Text;
	using System.Threading.Tasks;
	using System.Drawing;
	using System.Drawing.Imaging;
	using System.IO;
	 
	namespace Text2Image
	{
	    class Program
	    {
	        static void img2csv(string img_path)
	        {
	            FileInfo img_info = new FileInfo(img_path);
	            string destination_file_directory = img_info.DirectoryName + "\\";
	            string destination_file_name = img_info.Name.Remove(img_info.Name.LastIndexOf('.'), 4);
	            string destination_file_path = destination_file_directory + destination_file_name + ".csv";
	 
	            // Read the image
	            Bitmap img = new Bitmap(img_path);
	 
	            // Create the CSV File and write the header values
	            System.IO.StreamWriter file = new System.IO.StreamWriter(destination_file_path);
	            file.WriteLine("X,Y,R,G,B");
	 
	            // Write the Pixel values
	            for (int x = 0; x < img.Width; x++)
	                for (int y = 0; y < img.Height; y++)
	                {
	                    string line = x + "," + y + "," + img.GetPixel(x, y).R + "," + img.GetPixel(x, y).G + "," + img.GetPixel(x, y).B ;
	                    file.WriteLine(line);
	                }
	 
	            file.Close();
	        }
	 
	        static void csv2img(string csv_path)
	        {
	            FileInfo csv_info = new FileInfo(csv_path);
	            string destination_file_directory = csv_info.DirectoryName + "\\";
	            string destination_file_name = csv_info.Name.Remove(csv_info.Name.LastIndexOf('.'), 4);
	            string destination_file_path = destination_file_directory + destination_file_name + ".png";
	            
	            // Read all the lines in the CSV file
	            string[] lines = System.IO.File.ReadAllLines(csv_path);
	 
	            // set a new bitmap image with the provided width and height in the header
	            string[] wh = lines.Last().Split(new Char[] { ' ', ',', '.', ':', '\t', '{', '}' });
	            int img_width = Convert.ToInt32(wh[0])+1;
	            int img_height = Convert.ToInt32(wh[1])+1;
	 
	            Bitmap bmp_img = new Bitmap(img_width, img_height);
	 
	            for (int i = 1; i < lines.Length ;i++ )
	            {
	                string[] values = lines[i].Split(new Char[] { ' ', ',', '.', ':', '\t', '{', '}' });
	                if (values.Length < 3)
	                    continue;
	 
	                int x = Convert.ToInt16(values[0]);
	                int y = Convert.ToInt32(values[1]);
	                int r = Convert.ToInt32(values[2]);
	                int g = Convert.ToInt32(values[3]);
	                int b = Convert.ToInt32(values[4]);
	 
	                bmp_img.SetPixel(x, y, Color.FromArgb(r, g, b));
	            }
	 
	            bmp_img.Save(destination_file_path);
	        }
	 
	        static void Main(string[] args)
	        {
	            string source_path = args[1];
	            FileInfo source_info = new FileInfo(source_path);
	 
	            if (source_info.Extension == ".csv")
	                csv2img(source_path);
	            else
	                img2csv(source_path);
	        }
	    }
	}


## Sample Experiment

The following sample experiment associated with this model is available in ML Studio in the **EXPERIMENTS** section under the **SAMPLES** tab.

> **Sample Experiment - Color Based Image Compression using K-Means Clustering - Development**


## Sample Dataset

The following sample dataset used by this experiment is available in ML Studio in the module palette under **Saved Datasets**.

<ul>
<li><b>Bill Gates RGB Image</b><p></p>
[AZURE.INCLUDE [machine-learning-sample-dataset-bill-gates-rgb-image](../includes/machine-learning-sample-dataset-bill-gates-rgb-image.md)]
<p></p></li>
</ul>


[image1]:./media/machine-learning-sample-color-quantization-using-k-means-clustering/image1.png
[image2a]:./media/machine-learning-sample-color-quantization-using-k-means-clustering/image2a.jpg
[image2b]:./media/machine-learning-sample-color-quantization-using-k-means-clustering/image2b.png
[image2c]:./media/machine-learning-sample-color-quantization-using-k-means-clustering/image2c.png
[image2d]:./media/machine-learning-sample-color-quantization-using-k-means-clustering/image2d.png
[image2e]:./media/machine-learning-sample-color-quantization-using-k-means-clustering/image2e.png
[image2f]:./media/machine-learning-sample-color-quantization-using-k-means-clustering/image2f.png
[image3]:./media/machine-learning-sample-color-quantization-using-k-means-clustering/image3.png
