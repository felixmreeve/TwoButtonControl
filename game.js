var ticks = 0;

var game_state = 500;
var DEFAULT = 500;
var GAME_OVER = 501;
var KEY_NUM = 128;

var IDLE = 0, FEEDING = 1, DRINKING = 2, BUYING = 3, SELLING = 4, JUICING = 5, TRAINING = 6, DEAD = 7;

var current_key = 49;

var max_announcements = 5;
var init_money = 100;

var employee_cost = 100;

var init_apples = 100;
var apples = 0;

var init_juice_boxes = 100;
var juice_boxes = 0;

var text_start = 50;
var text_increment = 30;


var def_max_hunger = 1200;
var def_hunger_timer = (def_max_hunger*6)/10;
var def_hunger_down = -30;
var def_hunger_up = 10;

var def_max_thirst = 600;
var def_thirst_timer = (def_max_thirst*6)/10;
var def_thirst_down = -30;
var def_thirst_up = 10;

var def_juice_timer = -1;
var def_juice_speed = 5;

var def_buy_timer = -1;
var def_buy_speed = 5;
var def_apple_val = 5;

var def_sell_timer = -1;
var def_sell_speed = 5;
var def_juice_val = 10;

var def_employee_pos_x = 50;
var def_employee_pos_y = 100;
var cur_employee_pos_x;
var cur_employee_pos_y;

var money = 0;
var employees = [];
var employee_num = 0;
var announcements = ["hello"];
var current_announcement = 0;

var def_sprite;

function init()
{
	def_sprite = load_bmp("face.png");
	def_juice_speed = (def_juice_speed*3)/10;
	for (var i = 0; i < KEY_NUM; i++)
		employees[i] = { name:"Default", state:DEAD, timer:0, apple:false,
		                 hunger:0, hunger_timer:def_hunger_timer, max_hunger:def_max_hunger, hunger_down:def_hunger_down, hunger_up:def_hunger_up,
		                 thirst:0, thirst_timer:def_thirst_timer, max_thirst:def_max_thirst, thirst_down:def_thirst_down, thirst_up:def_thirst_up,
		                 juice_timer:def_juice_timer, juice_speed:def_juice_speed,
		            	 buy_timer:def_buy_timer, buy_speed:def_buy_speed, apple_val:def_apple_val,
		            	 sell_timer:def_sell_timer, sell_speed:def_sell_speed, juice_val:def_juice_val,
		            	 sprite:def_sprite, pos_x:50, pos_y:100 };
	apples = init_apples;
	juice_boxes = init_juice_boxes;
	for(var i = 0; i < max_announcements; i++) announcements[i] = "";
	cur_employee_pos_x = def_employee_pos_x;
	cur_employee_pos_y = def_employee_pos_y;
	addEmployee("Albert", KEY_A);
}
//draw to canvas
function draw()
{
	var text_pos_y = text_start;
	for(var i = current_announcement; i < max_announcements + current_announcement; i++){
		if(announcements[i%max_announcements] != ""){
			textout_right(canvas, font, announcements[i%max_announcements], SCREEN_W - 20, text_pos_y, 16, makecol(0, 0, 0));
			text_pos_y += text_increment;
		}
	}
	drawEmployees();
	drawInv();
	drawPrompts();

	if(game_state == GAME_OVER) textout(canvas, font, "GAME OVER", 120, SCREEN_H-100, 48, makecol(255, 0, 0), makecol(0, 0, 0), 3);
}

function drawPrompts()
{
	var prompt_x = 24;
	var prompt_y = SCREEN_H - 24;

	if (game_state == KEY_B) textout(canvas, font, "B:buy", prompt_x, prompt_y, 18, makecol(255, 0, 0));
	else textout(canvas, font, "B:buy", prompt_x, prompt_y, 16, makecol(0, 0, 0));
	prompt_x += 60;
	if (game_state == KEY_S) textout(canvas, font, "S:sell", prompt_x, prompt_y, 18, makecol(255, 0, 0));
	else textout(canvas, font, "S:sell", prompt_x, prompt_y, 16, makecol(0, 0, 0));
	prompt_x += 65;
	if (game_state == KEY_D) textout(canvas, font, "D:drink", prompt_x, prompt_y, 18, makecol(255, 0, 0));
	else textout(canvas, font, "D:drink", prompt_x, prompt_y, 16, makecol(0, 0, 0));
	prompt_x += 75;
	if (game_state == KEY_F) textout(canvas, font, "F:feed", prompt_x, prompt_y, 18, makecol(255, 0, 0));
	else textout(canvas, font, "F:feed", prompt_x, prompt_y, 16, makecol(0, 0, 0));
	prompt_x += 70;
	if (game_state == KEY_J) textout(canvas, font, "J:juice", prompt_x, prompt_y, 18, makecol(255, 0, 0));
	else textout(canvas, font, "J:juice", prompt_x, prompt_y, 16, makecol(0, 0, 0));
	prompt_x += 80;

	if (game_state == KEY_E) textout(canvas, font, "E:employ", prompt_x, prompt_y, 18, makecol(255, 0, 0));
	else textout(canvas, font, "E:employ", prompt_x, prompt_y, 16, makecol(0, 0, 0));
	prompt_x += 60;
}

function drawInv()
{
	var inv_x = 24;
	var inv_y = SCREEN_H - 24 - 40;
	textout(canvas, font, "Juice boxes:" + juice_boxes, inv_x, inv_y, 16, makecol(0, 0, 0));
	inv_y -= 40;
	textout(canvas, font, "Apples:" + apples, inv_x, inv_y, 16, makecol(0, 0, 0));
	inv_y -= 40;
	textout(canvas, font, "Money:" + money, inv_x, inv_y, 16, makecol(0, 0, 0));
}

function drawEmployees()
{
	for (var i = 0; i < KEY_NUM; i++){
		if (employees[i].state != DEAD){
				textout(canvas, font, getState(employees[i].state), employees[i].pos_x - 20, employees[i].pos_y - 60, 12, makecol(100, 100, 100));
				textout(canvas, font, employees[i].hunger, employees[i].pos_x - 20, employees[i].pos_y - 40, 16, makecol(180, 0, 0));
				textout(canvas, font, employees[i].thirst, employees[i].pos_x - 20, employees[i].pos_y - 20, 16, makecol(0, 0, 180));
				draw_sprite(canvas, employees[i].sprite, employees[i].pos_x, employees[i].pos_y);

				textout(canvas, font, employees[i].name[0], employees[i].pos_x - 5, employees[i].pos_y - 8, 10, makecol(0, 0, 0));
		}
	}
}

function getState(_state)
{
	//var IDLE = 0, FEEDING = 1, DRINKING = 2, BUYING = 3, SELLING = 4, JUICING = 5, TRAINING = 6, DEAD = 7;
	switch(_state){
		case IDLE:
			return "IDLE";
		case FEEDING:
			return "FEEDING";
		case DRINKING:
			return "DRINKING";
		case BUYING:
			return "BUYING";
		case SELLING:
			return "SELLING";
		case JUICING:
			return "JUICING";
		case TRAINING:
			return "TRAINING";
		default:
			return "ERROR";
	}
}

//update everything in game, is called every loop
function update()
{
	if(game_state == DEFAULT){
		if (key[KEY_B]) game_state = KEY_B;
		if (key[KEY_D]) game_state = KEY_D;
		if (key[KEY_E]){ game_state = KEY_E;}
		if (key[KEY_F]) game_state = KEY_F;
		if (key[KEY_J]) game_state = KEY_J;
		if (key[KEY_S]) game_state = KEY_S;
		if (key[KEY_T]) game_state = KEY_T;
	}
	else{
		switch (game_state){
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
		if (!key[KEY_B] && !key[KEY_D] && !key[KEY_E] && !key[KEY_F] && !key[KEY_J] && !key[KEY_S] && !key[KEY_T]) game_state = DEFAULT;
	}
	//update employees' stats
	if (ticks % 60 == 0 && employee_num > 0){
		updateEmployeesStats();

	}

	if (employee_num == 0){
		game_state = GAME_OVER;
	}
	ticks++;

	//reset ticks
	ticks %= 1000000000000;
}

function updateEmployeesPosition()
{

}

function updateEmployeesStats()
{
	var no_apples_flag = false;
	var no_juice_flag = false;

	for(var i = 0; i < KEY_NUM; i++){
		if(employees[i].state != DEAD){
			if (employees[i].state == FEEDING){
				if (employees[i].hunger > 0){
					employees[i].hunger += employees[i].hunger_down;
					if (employees[i].hunger < 0) employees[i].hunger = 0;
				}
				//if (employees[i].hunger == 0) employees[i].state = IDLE;
			}
			else employees[i].hunger += employees[i].hunger_up;
			
			if (employees[i].state == DRINKING){
				if (employees[i].thirst > 0){
					employees[i].thirst += employees[i].thirst_down;
					if (employees[i].thirst < 0) employees[i].thirst = 0;
				}
				//if (employees[i].thirst == 0) employees[i].state = IDLE;
			}
			else employees[i].thirst += employees[i].thirst_up;

			if (employees[i].state == JUICING && ticks % employees[i].juice_speed == 0){
				if (apples > 0){
					juice_boxes++;
					apples--;
				}
				else{
					no_apples_flag = true;
					employees[i].state = IDLE;
				}
			}

			if (employees[i].state == BUYING && ticks % employees[i].buy_speed == 0){
				if (apples > 0){
					apples++;
					money -= employees[i].apple_val;
				}
				else{
					no_apples_flag = true;
					employees[i].state = IDLE;
				}
			}

			if (employees[i].state == SELLING && ticks % employees[i].sell_speed == 0){
				if (juice_boxes > 0){
					juice_boxes--;
					money += employees[i].juice_val;
				}
				else{
					no_juice_flag = true;
					employees[i].state = IDLE;
				}
			}

			if (employees[i].timer > 0) employees[i].timer--;
			if (employees[i].timer == 0) employees[i].state = IDLE;
			//check to kill employee
			if (employees[i].hunger > employees[i].max_hunger || employees[i].thirst > employees[i].max_thirst){
				announce("" + employees[i].name + " has died.");
				employees[i].state = DEAD;
				employee_num--;
			}
		}
	}
	if(no_apples_flag) announce("There are no more apples.");
	if(no_juice_flag) announce("There is no more juice.");
}

function buy()
{
	var selection = getEmployee(KEY_B);
	if (selection && employees[selection].state != DEAD){
		if (money > 0){
			employees[selection].state = BUYING;
			employees[selection].timer = employees[selection].buy_timer;
			announce("" + employees[selection].name + " is buying apples");
		}
		else announce("There is no money for apples.");
	}
}

function feed()
{
	var selection = getEmployee(KEY_F);
	if (selection && employees[selection].state != DEAD){

		if (apples > 0){
			apples--;
			employees[selection].state = FEEDING;
			employees[selection].timer = employees[selection].hunger_timer;
			announce("" + employees[selection].name + " is eating an apple.");
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
			announce("" + employees[selection].name + " is drinking some juice.");
		}
		else announce("There is no juice to drink.");
	}
}

function employ()
{
	var selection = getEmployee(KEY_E);
	var name = getName(selection);
	if (selection){
		if (money > employee_cost){
			if (selection != KEY_B && selection != KEY_D && selection != KEY_E && selection != KEY_F && selection != KEY_J && selection != KEY_S && selection != KEY_T){
				if (employees[selection].state == DEAD) addEmployee(name, selection);
				else announce("" + employees[selection].name + " is already employed.");
			}
			else announce("Can't employ on a hotkey");
		}
		else announce("Not enough money.");
	}

}

function getName(_key)
{
	switch(_key){
		case KEY_A:
			return "Albert";
		case KEY_B:
			return "ERROR";
		case KEY_C:
			return "Caleb";
		case KEY_D:
			return "ERROR";
		case KEY_E:
			return "ERROR";
		case KEY_F:
			return "Florence";
		case KEY_G:
			return "Gladys";
		case KEY_H:
			return "Harrison";
		case KEY_I:
			return "Ingrid";
		case KEY_J:
			return "ERROR";
		case KEY_K:
			return "Keira";
		case KEY_L:
			return "Lola";
		case KEY_M:
			return "Margaret";
		case KEY_N:
			return "Noah";
		case KEY_O:
			return "Oscar";
		case KEY_P:
			return "Perry";
		case KEY_Q:
			return "Quentin";
		case KEY_R:
			return "Rose";
		case KEY_S:
			return "ERROR";
		case KEY_T:
			return "ERROR";
		case KEY_U:
			return "Ursula";
		case KEY_V:
			return "Velma";
		case KEY_W:
			return "William";
		case KEY_X:
			return "Xiao";
		case KEY_Y:
			return "Yaseen";
		case KEY_Z:
			return "Zachary";
		default:
			return 0;
	}
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
			announce("" + employees[selection].name + " is making juice.");
		}
		else announce("There are no apples for juice.");
	}
}

function sell()
{
	var selection = getEmployee(KEY_S);
	if (selection && employees[selection].state != DEAD){
		if (apples > 0){
			employees[selection].state = SELLING;
			employees[selection].timer = employees[selection].sell_timer;
			announce("" + employees[selection].name + " is selling juice.");
		}
		else announce("There is no juice to sell.");
	}
}

function getEmployee(_key_pressed)
{
	var result = 0;
	for(var i = 0; i < pressed.length; i++){
		if(released[i] && i != _key_pressed){
			result = i;
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

	employees[_key].name = _name;
	employees[_key].state = IDLE;
	employees[_key].pos_x = cur_employee_pos_x;
	employees[_key].pos_y = cur_employee_pos_y;
	employee_num++;
	cur_employee_pos_x += 80
	if (employee_num % 4 == 0){
		cur_employee_pos_x = def_employee_pos_x;
		cur_employee_pos_y += 100;
	}
}

//main function
function main()
{
	//debug mode on for testing, brings up box at bottom with information
	enable_debug('debug');
	//init allegro stuff
	allegro_init_all("game_canvas", 640, 480);
	//load png sprite, transparency colour is recognised
	
	init();
	//ready means function is not executed until everything is loaded
	ready(function(){
		//loop makes javascript run regularly
		//rather than wait for input
		loop(function(){
			//clear canvas
			clear_to_color(canvas, makecol(255, 255, 255));
			update();
			draw();
			if((key[KEY_E])) log("E")

		},BPS_TO_TIMER(60)); //60 fps
	});
	return 0;
}
END_OF_MAIN();
