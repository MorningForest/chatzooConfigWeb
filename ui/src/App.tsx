import style from './App.module.less';
// import Hello from "@/components/hello/hello";
import Home from '@/components/home/home';

function App() {
    return (
        <div className={style.app} id="app">
            <div className={style.content}>
                {/* <Hello /> */}
                <Home />
            </div>
        </div>
    );
}

export default App;
