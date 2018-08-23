# cs4249 Assignment 1
This repository contains a basic interface and instrumentation to perform an empirical evaluation of Marking Menus and Radial Menus. You are expected to modify the code to perform the following tasks
1. Implement a new Independent Variable
2. Implement a new Dependent Variable
3. Add the consent, pre-survey and post-survey questionnaires.

 You may fork this repository to your own Github account and clone your forked version for development. This will also help you use Github pages for hosting if you plan to conduct experiments online.
 
 ## Project Structure
 The interface is a static web project. However because of cross origin restrictions you will need a web server to run the experiment. Either turn on Github Pages(https://pages.github.com/) for your forked repository or setup a local server of your choice.
 
    ├── css                     # Style Sheets
         ├── external           
         ├── experiment.css    
    ├── js                      # Javascript
         ├── external          
         ├── experiment.js    
         ├── experiment-tracker.js
    ├── data           
         ├── experiment.csv     # Contains information about the trials
         ├── menu_depth_2.csv   # Menu with depth 2
         ├── manu_depth_3.csv   # Menu with depth 3
    ├── experiment.html    

Ideally, you shouldn't need to edit any of the files under "/external" unless your experimental design requires modifications to the menu implementation. Please avoid tweaking parameters of the menu such as color, size etc. To maintain consistency across the class we will use the default parameters as provided in this repository.

 ## Credits
This repository contains slightly modified implementations of menus from the original contributors listed below.
1. Marking Menu : Forked from https://github.com/QuentinRoy/Marking-Menu
2. Radial Menu : Forked from https://github.com/lgrkvst/d3-sunburst-menu
