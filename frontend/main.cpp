// ncurses manual
// https://invisible-island.net/ncurses/man/ncurses.3x.html
#include <ncurses.h>

int main(int argc, char *argv[])
{
    initscr();
    // use raw to control signals like CTRL-Z, otherwise use cbreak()
    cbreak();
    keypad(stdscr,TRUE);
    printw("Salam Sailor !!");

    int ch = getch();
    if(ch == KEY_F(1)) {
	printw("\n F1 is pressed");
    } else {
	printw("\n pressed key is ");
	attron(A_BOLD);
	printw("%c", ch);
	attroff(A_BOLD);
    }
    refresh();
    getch();
    endwin();
    
    return 0;
}
