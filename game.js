var ticks = 0;

var state = 0;
var DEFAULT = 500;
var GAME_OVER = 501;
var KEY_NUM = 128;

var IDLE = 0, FEEDING = 1, DRINKING = 2, COOKING = 3, JUICING = 4, TRAINING = 5, DEAD = 6;

var current_key = 49;

var max_announcements = 5;
var init_money = 100;

var init_apples = 100;
var apples = 0;

var init_juice_boxes = 100;
var juice_boxes = 0;

var text_start = 50;
var text_increment = 50;


var def_max_hunger = 120;
var def_max_thirst = 60;
var def_hunger_timer = (def_max_hunger*6)/10;
var def_thirst_timer = (def_max_thirst*6)/10;
var def_juice_timer = -1;
var def_juice_speed = 5;

var money = 0;
var employees = [];
var employee_num = 0;
var announcements = ["hello"];
var current_announcement = 0;

var ship_x = 100, ship_y = 100;

function init()
{
	def_juice_speed = (def_juice_speed*3)/10;
	for (var i = 0; i < KEY_NUM; i++) employees[i] = {name:"Default", state:DEAD, timer:0, hunger:0, thirst:0, apple:false, hunger_timer:def_hunger_timer, thirst_timer:def_thirst_timer, max_hunger: def_max_hunger, max_thirst:def_max_thirst, juice_timer:def_juice_timer, juice_speed:def_juice_speed};
	apples = init_apples;
	juice_boxes = init_juice_boxes;
	for(var i = 0; i < max_announcements; i++) announcements[i] = "";
	addEmployee("Albert", KEY_A);
}
//draw to canvas
function draw()
{
	textout(canvas, font, ship_x, ship_x, ship_y, 24, makecol(0, 0, 0));
	draw_sprite(canvas, ship, ship_x, ship_y);

	var text_pos_y = text_start;
	for(var i = current_announcement; i < max_announcements + current_announcement; i++){
		if(announcements[i%max_announcements] != ""){
			textout_right(canvas, font, announcements[i%max_announcements], SCREEN_W - 20, text_pos_y, 24, makecol(0, 0, 0));
			text_pos_y += text_increment;
		}
	}
	if(state == GAME_OVER) textout(canvas, font, "GAME OVER", 120, SCREEN_H-100, 48, makecol(255, 0, 0), makecol(0, 0, 0), 3);

	drawInv();
	drawPrompts();
}

function drawPrompts()
{
	var prompt_x = 24;
	var prompt_y = SCREEN_H - 24;

	if (state == KEY_B) textout(canvas, font, "B:buy", prompt_x, prompt_y, 18, makecol(255, 0, 0));
	else textout(canvas, font, "B:buy", prompt_x, prompt_y, 16, makecol(0, 0, 0));
	prompt_x += 60;
	if (state == KEY_S) textout(canvas, font, "S:sell", prompt_x, prompt_y, 18, makecol(255, 0, 0));
	else textout(canvas, font, "S:sell", prompt_x, prompt_y, 16, makecol(0, 0, 0));
	prompt_x += 65;
	if (state == KEY_D) textout(canvas, font, "D:drink", prompt_x, prompt_y, 18, makecol(255, 0, 0));
	else textout(canvas, font, "D:drink", prompt_x, prompt_y, 16, makecol(0, 0, 0));
	prompt_x += 75;
	if (state == KEY_F) textout(canvas, font, "F:feed", prompt_x, prompt_y, 18, makecol(255, 0, 0));
	else textout(canvas, font, "F:feed", prompt_x, prompt_y, 16, makecol(0, 0, 0));
	prompt_x += 70;
	if (state == KEY_J) textout(canvas, font, "J:juice", prompt_x, prompt_y, 18, makecol(255, 0, 0));
	else textout(canvas, font, "J:juice", prompt_x, prompt_y, 16, makecol(0, 0, 0));
	prompt_x += 60;
}

function drawInv()
{
	var inv_x = 24;
	var inv_y = SCREEN_H - 24 - 40;
	textout(canvas, font, "Apples:" + apples, inv_x, inv_y, 16, makecol(0, 0, 0));
	inv_y -= 40;
	textout(canvas, font, "Juice boxes:" + juice_boxes, inv_x, inv_y, 16, makecol(0, 0, 0));
}

//update everything in game, is called every loop
function update()
{
	if(state == DEFAULT){
		if (key[KEY_B]) state = KEY_B;
		if (key[KEY_D]) state = KEY_D;
		if (key[KEY_E]) state = KEY_E;
		if (key[KEY_F]) state = KEY_F;
		if (key[KEY_J]) state = KEY_J;
		if (key[KEY_S]) state = KEY_S;
		if (key[KEY_T]) state = KEY_T;
	}
	else{
		switch (state){
			case KEY_B:
				buy();
				break;
			case KEY_D:
				drink();
				break;
			case KEY_E:
				employ();
				break;
			case KEY_F:
				feed();
				break;
			case KEY_J:
				juice();
				break;
			case KEY_S:
				sell();
				break;
			case KEY_T:
				train();
				break;
		}
		if(!key[KEY_B] && !key[KEY_D] && !key[KEY_E] && !key[KEY_F] && !key[KEY_J] && !key[KEY_S] && !key[KEY_T]) state = DEFAULT;
	}
	//update employees
	if(ticks % 60 == 0 && employee_num > 0){
		log("update");
		updateEmployees();
	}

	if(employee_num == 0){
		state = GAME_OVER;
	}
	ticks++;
	//reset tick every now and again?
	ticks % 100000000000;
}

function updateEmployees()
{
	for(var i = 0; i < KEY_NUM; i++){
		if(employees[i].state != DEAD){
			if (employees[i].state == FEEDING) employees[i].hunger--;
			else employees[i].hunger++;
			if (employees[i].state == DRINKING)	employees[i].thirst--;
			else employees[i].thirst++;

			if (employees[i].state == JUICING && ticks % employees[i].juice_speed == 0){
				juice_boxes++;
				apples--;
			}

			employees[i].timer--;
			if(employees[i].timer == 0) state = IDLE;
			//check to kill employee
			if(employees[i].hunger>employees[i].max_hunger || employees[i].thirst>employees[i].max_thirst){
				announce("" + employees[i].name + " has died.");
				employees[i].state = DEAD;
				employee_num--;
			}
		}
	}
}

function buy()
{
	log("buying");
}

function feed()
{
	var selection = getEmployee(KEY_F);
	if (selection && employees[selection].state != DEAD){

		if (apples > 0){
			apples--;
			employees[selection].state = FEEDING;
			employees[selection].timer = employees[selection].hunger_timer;
			announce("" + employees[selection].name + " is eating an apple." );
		}
		else announce("There is no food to eat.");
	}
}

function drink(){
	var selection = getEmployee(KEY_D);
	if (selection && employees[selection].state != DEAD){
		if (juice_boxes > 0){
			employees[selection].state = DRINKING;
			employees[selection].timer = employees[selection].thirst_timer;
			announce("" + employees[selection].name + " is drinking some juice." );
		}
		else announce("There is no juice to drink.");
	}
}

function employ()
{

}

function juice()
{
	var selection = getEmployee(KEY_J);
	if (selection && employees[selection].state != DEAD){

		if (apples > 0){
			apples--;
			employees[selection].apple = true;
			employees[selection].state = JUICING;
			employees[selection].timer = employees[selection].juice_timer;
			announce("" + employees[selection].name + " is making juice");
		}
		else announce("There are no apples for juice.");
	}
}

function getEmployee(_key_pressed)
{
	var result = 0;
	for(var i = 0; i < pressed.length; i++){
		if(released[i] && i != _key_pressed){
			result = i;
			log(result);
		}
	}
	return result;
}

function announce(_str)
{
	announcements[current_announcement++] = _str;
	current_announcement %= max_announcements;
}

function addEmployee(_name, _key)
{
	announce("You employed " + _name + ".");

	employees[_key] = {name:_name, state:IDLE, timer:0, hunger:0, thirst:0, apple:false, hunger_timer:def_hunger_timer, thirst_timer:def_thirst_timer, max_hunger: def_max_hunger, max_thirst:def_max_thirst, juice_timer:def_juice_timer, juice_speed:def_juice_speed};
	employee_num++;
}

//main function
function main()
{
	//debug mode on for testing, brings up box at bottom with information
	enable_debug('debug');
	//init allegro stuff
	allegro_init_all("game_canvas", 640, 480);
	//load png sprite, transparency colour is recognised
	ship = load_bmp("face.png");

	//ready means function is not executed until everything is loaded
	ready(function(){
		init();
		//loop makes javascript run regularly
		//rather than wait for input
		loop(function(){
			//clear canvas
			clear_to_color(canvas, makecol(255, 255, 255));
			update();
			draw();
		},BPS_TO_TIMER(60)); //60 fps
	});
	return 0;
}
END_OF_MAIN();
