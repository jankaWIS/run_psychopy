//This commands imports the basic styling available with gorilla
@import
"/style/style.less";

// This file is formatted in the same a normal css file for a webpage would be
// You can use the same style of selectors (. for classes, # for id's etc)
// and have access to all the same properties
// in the example below, we're giving any element with the class img a border
// to make it stand out from the background more obviously
// .img {
//     border: 8px solid black;
// }

// We're going to add some styling here for the number zones

// create a class for having hints (what to press) after showing the stimuli when they should respond
.
s - hint
{
	text - align
:
	center;
}


// standard number zone style
.
number - zone
{
	font - size
:
	64
	px;
	8
	px
	solid
	black;

}

// activated number zone style
.
selected
{
	8
	px
	solid
	Chartreuse
	!important;
}


// .c-answer-button {
//     font-size:64px;
//     padding-top: 0px;
//     padding-bottom: 0px;
//     padding-left: 3px;
//     padding-right: 3px;
// }

.
s - fixation
{
	block;
	relative;
	30 %;
	margin - top
:
	0;
	font - size
:
	200
	px;
	text - align
:
	center;
}

// .s-question-container {
//     display:block;
//     position:relative;
//     top:30%;
//     margin-top:0;
// 	text-align:left;
// }

// .s-buttons-container {
// 	text-align:center;
// }

.
s - answer - green
{
.
	btn - success();
}

.
s - answer - red
{
.
	btn - danger();
}
