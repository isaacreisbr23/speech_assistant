import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import StatusBadge from "./elements/statusChecker";

export default function Home() {
    const [open, setOpen] = useState(false);
    const [nome, setNome] = useState("");
    const [comando, setComando] = useState("");

    const [openLista, setOpenLista] = useState(false);
    const [comandos, setComandos] = useState<any[]>([]);
    const [categoria, setCategoria] = useState("");

    const [rodando, setRodando] = useState(false);

    const check = async () => {
        const result = await window.api.processoRodando("speech_assistant_app");
        console.log(result);
        setRodando(result);
    };

    useEffect(() => {
        check();
        const interval = setInterval(() => {
            check();
        }, 10000); // 10 segundos
        return () => clearInterval(interval);
    }, []);

    const carregarComandos = async () => {
        const lista = await window.api.listarComandos();
        setComandos(lista);
    };

    const handleCriar = async () => {
        if (!nome || !comando || !categoria) {
            alert("Preencha todos os campos");
            return;
        }

        const caminho = await window.api.criarArquivo(nome, comando, categoria);
        alert("Arquivo criado em: " + caminho);

        setNome("");
        setComando("");
        setOpen(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-3xl p-6"
            >
                <Card className="rounded-2xl shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20">
                    <CardContent className="p-8">
                        <h1 className="text-3xl font-bold text-white mb-6 text-center">
                            Painel de Comandos

                        </h1>
                        <div className="flex items-center gap-3">
                            <p className="text-blue-100">
                                Gerencie e visualize seus comandos personalizados de forma rápida e intuitiva.
                            </p>

                            <StatusBadge active={rodando} label="Ouvindo" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                            <motion.div whileHover={{ scale: 1.05 }}>
                                <Button
                                    className="w-full h-28 text-lg rounded-2xl bg-blue-500 hover:bg-blue-400 text-white flex flex-col items-center justify-center gap-2"
                                    onClick={() => setOpen(true)}
                                >
                                    <Plus size={28} />
                                    Registrar Novo Comando
                                </Button>
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.05 }}>
                                <Button
                                    className="w-full h-28 text-lg rounded-2xl bg-blue-800 hover:bg-blue-700 text-white flex flex-col items-center justify-center gap-2"
                                    onClick={async () => {
                                        await carregarComandos();
                                        setOpenLista(true);
                                    }}
                                >
                                    <List size={28} />
                                    Visualizar Comandos
                                </Button>
                            </motion.div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* MODAL */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="bg-white text-black rounded-xl">
                    <DialogHeader>
                        <DialogTitle>Novo Comando</DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col gap-4 mt-4">
                        <div className="flex flex-col gap-4 mt-4">
                            <Select onValueChange={setCategoria}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione a categoria" />
                                </SelectTrigger>

                                <SelectContent className="z-[9999] bg-white text-black shadow-lg border border-gray-200">
                                    <SelectItem value="abertura_arquivo">
                                        Abertura de arquivo
                                    </SelectItem>

                                    <SelectItem value="controle_sistema">
                                        Controle do sistema
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Input
                                placeholder="Nome do comando (o mesmo que você irá falar)"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                            />

                            <Input
                                placeholder="Comando"
                                value={comando}
                                onChange={(e) => setComando(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter className="mt-6">
                        <Button variant="ghost" onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleCriar}>
                            Salvar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <p>Repositório do github.</p>
            {/* MODAL DE LISTA DOS ARQUIVOS */}

            <Dialog open={openLista} onOpenChange={setOpenLista}>
                <DialogContent className="bg-white text-black rounded-xl max-h-[500px] overflow-auto">
                    <DialogHeader>
                        <DialogTitle>Comandos Salvos</DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col gap-3 mt-4">
                        {comandos.length === 0 ? (
                            <p className="text-gray-500 text-center">
                                Nenhum comando encontrado.
                            </p>
                        ) : comandos.map((cmd, index) => (
                            <div
                                key={index}
                                className="p-3 rounded-lg border border-gray-200 bg-gray-50"
                            >
                                <p className="font-semibold">{cmd.nome}</p>

                                <p className="text-xs text-gray-400 break-all">
                                    {cmd.caminho}
                                </p>

                                <p className="text-xs text-blue-500 font-medium">
                                    {cmd.categoria}
                                </p>

                                <div className="mt-2 p-2 bg-black text-green-400 rounded text-sm font-mono break-all">
                                    {cmd.conteudo}
                                </div>
                            </div>
                        ))}
                    </div>

                    <DialogFooter className="mt-4">
                        <Button onClick={() => setOpenLista(false)}>
                            Fechar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}