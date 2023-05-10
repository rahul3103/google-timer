"use client";
import { useEffect, useRef } from "react";
import { create } from "zustand";
import StopwatchIcon from "../public/stopwatch.svg";
import TimerIcon from "../public/timer.svg";

const tabs = [
  { title: "TIMER", id: 0, Icon: TimerIcon },
  { title: "STOPWATCH", id: 1, Icon: StopwatchIcon },
];

const timerInitialVal = 500;

function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function useOutsideClick(callback) {
  const ref = useRef();

  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [ref, callback]);

  return ref;
}

function addHMS(number) {
  const paddedNumber = number.toString().padStart(6, "0");
  const hours = paddedNumber.slice(0, 2);
  const minutes = paddedNumber.slice(2, 4);
  const seconds = paddedNumber.slice(4, 6);
  return hours + "h" + minutes + "m" + seconds + "s";
}

function convertHMSToSeconds(input) {
  const hours = Math.floor(input / 10000);
  const minutes = Math.floor((input % 10000) / 100);
  const seconds = input % 100;
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  return totalSeconds;
}

function convertSecondsToHMS(seconds, addHMS = false, addZeroPadding = false) {
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds % 3600) / 60);
  let remainingSeconds = seconds % 60;
  if (addZeroPadding) {
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    remainingSeconds = remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;
  }
  if (addHMS) {
    let time = "";
    if (hours) time += hours + "h";
    if (minutes) time += minutes + "m";
    time += remainingSeconds + "s";
    return time;
  }
  return parseInt(hours + minutes + remainingSeconds);
}

function padWithZeros(digit = "") {
  let strInput = digit.toString();
  let numZeros = 6 - strInput.length;
  if (numZeros <= 0) {
    return strInput.slice(-6);
  }
  let zeros = "0".repeat(numZeros);
  return zeros + strInput;
}

const useTabStore = create((set) => ({
  selectedTab: tabs[0].id,
  setSelectedTab: (tab) => set({ selectedTab: tab }),
}));

const useTimerStore = create((set, get) => ({
  delayVal: 1000,
  timerVal: convertHMSToSeconds(timerInitialVal),
  setTimerVal: (timerVal) => set({ timerVal }),
  decreaseTimerVal: () => set({ timerVal: parseInt(get().timerVal) - 1 }),
  startTimer: () => set({ delayVal: 1000 }),
  stopTimer: () => set({ delayVal: null }),
  resetTimer: () => set({ timerVal: convertHMSToSeconds(timerInitialVal) }),
}));

const useInputStore = create((set) => ({
  input: timerInitialVal,
  isInputSelected: false,
  setIsInputSelected: (val) => set({ isInputSelected: val }),
  setInput: (input) => set({ input: padWithZeros(input) }),
  resetInput: () => set({ input: timerInitialVal }),
}));

function Tab({ tab }) {
  const { title, id, Icon } = tab;
  const [selectedTab, setSelectedTab] = useTabStore(({ selectedTab, setSelectedTab }) => [
    selectedTab,
    setSelectedTab,
  ]);

  function onTabClick() {
    setSelectedTab(id);
  }

  const isSelected = selectedTab === id;
  const selectedStyle = isSelected ? "border-b-2 border-google-blue-100" : "";
  const textColor = isSelected ? "text-google-blue-100" : "text-google-gray-200 hover:text-white";
  const iconColor = isSelected ? "fill-google-blue-100" : "fill-google-gray-200 hover:fill-white";
  return (
    <li
      onClick={onTabClick}
      className={`flex grow cursor-pointer items-center justify-center ${selectedStyle} ${textColor} ${iconColor}`}
    >
      <span>
        <Icon className="w-[15px]" />
      </span>
      <span>{title}</span>
    </li>
  );
}

function Tabs() {
  return (
    <ul className="flex h-12 items-stretch border-b border-google-gray-100 text-center text-sm">
      {tabs.map((tab) => (
        <Tab key={tab.id} tab={tab} />
      ))}
    </ul>
  );
}

function Actions() {
  const [delayVal, startTimer, stopTimer, resetTimer] = useTimerStore(
    ({ delayVal, startTimer, stopTimer, resetTimer }) => [
      delayVal,
      startTimer,
      stopTimer,
      resetTimer,
    ]
  );
  const resetInput = useInputStore(({ resetInput }) => resetInput);

  function handleStartButtonOnClick() {
    if (delayVal) {
      stopTimer();
    } else {
      startTimer();
    }
  }

  function handleResetButtonOnClick() {
    stopTimer();
    resetInput();
    resetTimer();
  }

  const startButtonText = delayVal ? "STOP" : "START";
  return (
    <div className="relative flex border-t border-google-gray-100 py-4">
      <Progress />
      <span className="ml-4 flex gap-4">
        <button
          onClick={handleStartButtonOnClick}
          className="min-w-[72px] rounded-sm border border-google-blue-100 bg-google-blue-100 px-2 pb-[5px] pt-[6px] text-[11px] font-bold leading-4 text-google-gray-300 hover:border-google-blue-200 hover:bg-google-blue-200"
        >
          {startButtonText}
        </button>
        <button
          onClick={handleResetButtonOnClick}
          className="min-w-[72px] rounded-sm border border-google-gray-100 bg-google-gray-600 px-2 pb-[5px] pt-[6px] text-[11px] font-bold leading-4 text-google-gray-300 hover:border-google-black-100 hover:bg-google-black-200"
        >
          RESET
        </button>
      </span>
    </div>
  );
}

function Progress() {
  const input = useInputStore(({ input }) => input);
  const delayVal = useTimerStore(({ delayVal }) => delayVal);
  const animationPlayState = !delayVal ? "paused" : "running";
  const background = delayVal ? "bg-google-blue-100" : "bg-google-gray-500";
  return (
    <div
      style={{ animationDuration: input + "s", animationPlayState }}
      className={`absolute left-0 top-[-2px] z-10 h-[3px] w-[0%] animate-progress ${background}`}
    />
  );
}

function Input({ inputReference }) {
  const [input, setInput] = useInputStore(({ input, setInput }) => [input, setInput]);
  const [timerVal, setTimerVal] = useTimerStore(({ timerVal, setTimerVal }) => [
    timerVal,
    setTimerVal,
  ]);
  function handleOnChange({ target }) {
    setTimerVal(0);
    setInput(target.value);
  }
  return (
    <input
      ref={inputReference}
      type="tel"
      pattern="\d*"
      value={timerVal ? "" : input}
      onChange={handleOnChange}
      className="absolute top-0 -z-10 h-0 w-0 opacity-0"
    />
  );
}

function TextField({ inputReference }) {
  const [input, setInput, isInputSelected, setIsInputSelected] = useInputStore(
    ({ input, setInput, isInputSelected, setIsInputSelected }) => [
      input,
      setInput,
      isInputSelected,
      setIsInputSelected,
    ]
  );
  const [timerVal, setTimerVal, stopTimer] = useTimerStore(
    ({ timerVal, setTimerVal, stopTimer }) => [timerVal, setTimerVal, stopTimer]
  );

  function handleClickOutside() {
    if (isInputSelected) {
      setIsInputSelected(false);
      stopTimer();
      setTimerVal(convertHMSToSeconds(input));
    }
  }

  function handleOnClick() {
    const end = input.length;
    inputReference.current.setSelectionRange(end, end);
    inputReference.current.focus();
    setIsInputSelected(true);
    stopTimer();
    setInput(convertSecondsToHMS(timerVal, false, true));
  }

  const ref = useOutsideClick(handleClickOutside);
  const texts = isInputSelected
    ? addHMS(input).split("")
    : convertSecondsToHMS(timerVal, true).split("");
  const fontColor = isInputSelected ? "text-google-gray-400" : "text-white";

  return (
    <div ref={ref} onClick={handleOnClick} className={`cursor-pointer ${fontColor}`}>
      {texts.map((text, index) => {
        const fontSize = isNaN(text) ? "text-[28px]" : "text-[62px]";
        const padding = isNaN(text) && index !== texts.length - 1 ? "pr-[18px]" : "";
        const border = index === texts.length - 2 && isInputSelected ? "border-r border-white" : "";
        return (
          <span className={`${fontSize} ${border} ${padding} tabular-nums`} key={index}>
            {text}
          </span>
        );
      })}
    </div>
  );
}

function Timer() {
  const inputReference = useRef(null);
  const isInputSelected = useInputStore(({ isInputSelected }) => isInputSelected);
  const border = isInputSelected
    ? "border-google-blue-100 border-b-2"
    : "border-google-gray-100 border-b";

  return (
    <div className="relative flex grow items-center">
      <div className={`ml-4 w-fit px-[12px] py-[5px] ${border}`}>
        <TextField inputReference={inputReference} />
      </div>
      <Input inputReference={inputReference} />
    </div>
  );
}

export default function Google() {
  const [delayVal, decreaseTimerVal] = useTimerStore(({ delayVal, decreaseTimerVal }) => [
    delayVal,
    decreaseTimerVal,
  ]);
  useInterval(decreaseTimerVal, delayVal);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-google-gray-300">
      <div className="flex h-[260px] w-[650px] flex-col rounded-lg border border-google-gray-100">
        <Tabs />
        <Timer />
        <Actions />
      </div>
    </div>
  );
}
