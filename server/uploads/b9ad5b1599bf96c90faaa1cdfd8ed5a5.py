import tkinter
import tkinter.ttk
import tkinter.messagebox
from collections import deque
import matplotlib.pyplot as plt


def get_vessels(a, water, n):
    ans = [0] * n
    i, j = 0, 0
    d = deque()

    while True:
        if j - i:
            level = water / (j - i + 1)
            m = a[d[0]]
            if m > level:
                water -= m
                ans[i] = m
                if d[0] == i:
                    d.popleft()
                i += 1
            elif j < n - 1 and level > a[j]:
                while len(d) and a[d[-1]] <= a[j]:
                    d.pop()
                d.append(j)
                j += 1
            else:
                break
        else:
            if j < n - 1 and water > a[j]:
                while len(d) and a[d[-1]] <= a[j]:
                    d.pop()
                d.append(j)
                j += 1
            else:
                break

    level = water / (j - i + 1)
    for x in range(i, j + 1):
        ans[x] = level

    return ans


def info():
    text = '''
    Привет, это инструкция к  программе!

    В этой программе ты можешь выбрать два различных вывода ответа,
    для этого достаточно отметить галочкой.

    После, необходимо ввести количество сосудов и воды(в литрах).

    Далее, надо ввести числа ЧЕРЕЗ ПРОБЕЛ, это высоты для кождой
    разделяющей сосуды палки.
    '''
    tkinter.messagebox.showinfo('Инструкция', text)


def bar_chart(ans):
    n = len(ans)
    x = [x for x in range(1, n + 1)]
    max_num = max(ans)
    y = [max_num + max_num / 35] * (n)
    plt.bar(x, y, width=1, color='#593315')
    plt.bar(x, [max_num + max_num / 100] * (n), width=0.8, color='#fffaf0')
    plt.bar(x, ans, width=0.8)
    plt.show()


class Application(tkinter.ttk.Frame):
    def __init__(self, master=None):
        super().__init__(master)
        self.pack()
        self.create_widgets()
        self.master.title('Сообщающиеся сосуды')
        self.master.resizable(False, False)

    def create_widgets(self):
        self.var_CheckB_histograms = tkinter.BooleanVar()
        self.var_CheckB_histograms.set(False)
        self.CheckB_histograms = tkinter.ttk.Checkbutton(self,
                                                         text='Вывод гистограммой',
                                                         variable=self.var_CheckB_histograms, onvalue=True,
                                                         offvalue=False)
        self.CheckB_histograms.pack()

        self.var_CheckB_num = tkinter.BooleanVar()
        self.var_CheckB_num.set(False)
        self.CheckB_num = tkinter.ttk.Checkbutton(self,
                                                  text='Вывод числовыми значениями',
                                                  variable=self.var_CheckB_num, onvalue=True, offvalue=False)
        self.CheckB_num.pack()

        self.labelw = tkinter.ttk.Label(self, text='Количество воды в литрах')
        self.labelw.pack()

        self.spnw = tkinter.Spinbox(self, from_=0, to=int(10e4),
                                    increment=1, exportselection=1, relief=tkinter.GROOVE,
                                    bd=7, buttonbackground='green', width=6)
        self.spnw.pack()

        self.label_vessels = tkinter.ttk.Label(self, text='Количество сосудов')
        self.label_vessels.pack()

        self.spn_vessels = tkinter.Spinbox(self, from_=0, to=int(10e4),
                                           increment=1, exportselection=1, relief=tkinter.GROOVE,
                                           bd=7, buttonbackground='green', width=6)
        self.spn_vessels.pack()

        self.ent_heights = tkinter.ttk.Entry(self)
        self.ent_heights.pack()

        self.var_entry_ans = tkinter.StringVar()
        self.var_entry_ans.set('Тут будет ответ')
        self.entry_ans = tkinter.ttk.Entry(self, textvariable=self.var_entry_ans)  # relief = tkinter.SUNKEN,
        self.entry_ans.pack()

        self.bt_start = tkinter.ttk.Button(self, text='Старт')
        self.bt_start.bind('<ButtonRelease>', self.start)
        self.bt_start.pack()

        self.bt_info = tkinter.ttk.Button(self, text='Инструкция', command=info)
        self.bt_info.pack()

        self.bt_exit = tkinter.ttk.Button(self, text='Выход', command=root.destroy)
        self.bt_exit.pack()

    def start(self, evt):
        self.var_entry_ans.set('Тут будет ответ')
        if self.var_CheckB_histograms.get() or self.var_CheckB_num.get():
            ans = get_vessels(list(map(int, self.ent_heights.get().split())),
                                   int(self.spnw.get()), int(self.spn_vessels.get()))
            if self.var_CheckB_histograms.get():
                bar_chart(ans)
            if self.var_CheckB_num.get():
                self.var_entry_ans.set(', '.join(map(str, ans)))


root = tkinter.Tk()
Application(master=root)
root.mainloop()
