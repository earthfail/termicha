// ncurses manual
// https://invisible-island.net/ncurses/man/ncurses.3x.html
#include <cstdlib>
#include <ncurses.h>
// #include <form.h>
#include <string.h>
enum WinState {LOGIN,CHAT,EXIT};
int main(int argc, char *argv[])
{
    enum WinState state = LOGIN;
    WINDOW *mainwin;
    mainwin=initscr(); // initscr() is also stored in stdscr
    // Note(Salim): check if this is actually needed
    // setlocale(LC_ALL,""); // to use with form.h if needed
    if(NULL == mainwin) {
	fprintf(stderr, "FAILED to Initalize ncurses. exiting\n");
	exit(EXIT_FAILURE);
    }
    // use raw to control signals like CTRL-Z, otherwise use cbreak()
    cbreak();
    noecho();
    keypad(mainwin,TRUE);
    int rows,columns;
    getmaxyx(stdscr,rows,columns);

    while(EXIT != state) {
	switch (state) {
	case LOGIN: {
	    const char* login = "Login to server";
	    const int len = strlen(login);
	    int form_height = 25;
	    int form_width = 50;
	    mvprintw(rows/2 - 1 -form_height/2,columns/2 - len/2,login);
	    WINDOW *formwin = subwin (mainwin, form_height, form_width, rows/2-form_height/2, columns/2 - form_width/2);
	    box(formwin,0,0);
	    wmove(formwin,1,1);
	    for (;;) {
		char c = getch();
		if('q'==c) {
		    state = EXIT;
		    delwin(formwin);
		    break;
		}
		wprintw(formwin,"Hi my name is %s","salim");
		wrefresh(formwin);
	    }
	    break;
	}
	default:
	    break;
	}
	refresh();
    }
    endwin();
    return 0;
}
